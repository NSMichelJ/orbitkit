export class Tab {
  private tab: HTMLElement;
  private tabList: HTMLElement | null;
  private tabsTrigger: NodeListOf<HTMLElement> | null;
  private tabContents: NodeListOf<HTMLElement> | null;
  private contentMap: Map<string, HTMLElement> = new Map();

  constructor(tabWrapper: HTMLElement) {
    this.tab = tabWrapper;
    this.tabList = this.tab.querySelector("[data-tab-list]");
    this.tabsTrigger =
      this.tabList?.querySelectorAll("[data-tab-trigger]") || null;
    this.tabContents = this.tab.querySelectorAll("[data-tab-content]");

    this.initializeContentMap();
    this.init();
  }

  private init() {
    this.setupAccessibility();
    this.setupEventListeners();
    this.setDefaultTab();
  }

  private initializeContentMap(): void {
    this.tabContents?.forEach((content) => {
      const value = content.dataset.value?.toLowerCase();
      if (value) {
        if (this.contentMap.has(value)) {
          console.warn(
            `Duplicate data-value "${value}" found in content elements`,
          );
        }
        this.contentMap.set(value, content);
      }
    });
  }

  private setupAccessibility() {
    this.tabsTrigger?.forEach((trigger) => {
      const triggerValue = trigger.dataset.value?.toLowerCase();
      if (!triggerValue) return;

      const content = this.contentMap.get(triggerValue);
      if (!content) {
        console.warn(`No content found for trigger value: ${triggerValue}`);
        return;
      }

      const uniqueId = Math.random().toString(36).substring(2, 9);
      const triggerId = trigger.id || `tab-trigger-${triggerValue}-${uniqueId}`;
      const contentId = content.id || `tab-content-${triggerValue}-${uniqueId}`;

      trigger.setAttribute("id", triggerId);
      trigger.setAttribute("aria-controls", contentId);

      content.setAttribute("id", contentId);
      content.setAttribute("aria-labelledby", triggerId);
    });
  }

  private setupEventListeners() {
    this.tabsTrigger?.forEach((trigger) => {
      trigger.addEventListener("click", () => this.activateTab(trigger));
      trigger.addEventListener("keydown", (e) =>
        this.handleKeydown(e, trigger),
      );
    });
  }

  private handleKeydown(event: KeyboardEvent, item: HTMLElement) {
    const items = Array.from(this.tabsTrigger || []);
    const currentItemIndex = items.indexOf(item);

    const keyActions: Record<string, () => void> = {
      ArrowRight: () => this.setFocusItem(items, currentItemIndex + 1),
      ArrowLeft: () => this.setFocusItem(items, currentItemIndex - 1),
      Home: () => this.setFocusItem(items, 0),
      End: () => this.setFocusItem(items, items.length - 1),
    };

    const action = keyActions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  private setFocusItem(items: HTMLElement[], index: number) {
    const newIndex = index % items.length;
    if (items[newIndex]) {
      this.activateTab(items[newIndex]);
    }
  }

  private setDefaultTab() {
    const defaultTrigger = this.getDefaultTrigger();
    if (defaultTrigger) {
      this.activateTab(defaultTrigger);
    }
  }

  private getDefaultTrigger(): HTMLElement | undefined {
    if (!this.tabsTrigger) return;

    const defaultValue = this.tab.dataset.defaultValue?.toLowerCase();
    if (defaultValue) {
      return Array.from(this.tabsTrigger || []).find(
        (trigger) => trigger.dataset.value?.toLowerCase() === defaultValue,
      );
    }
    return this.tabsTrigger[0];
  }

  private activateTab(trigger: HTMLElement) {
    this.tabsTrigger?.forEach((t) => {
      t.setAttribute("aria-selected", "false");
      t.setAttribute("data-selected", "false");
      t.setAttribute("tabindex", "-1");
    });

    this.tabContents?.forEach((c) => {
      c.setAttribute("data-state", "active");
      c.setAttribute("hidden", "");
    });

    const triggerValue = trigger.dataset.value?.toLowerCase();
    if (triggerValue) {
      const content = this.contentMap.get(triggerValue);
      if (content) {
        content.removeAttribute("hidden");
        setTimeout(() => {
          content.setAttribute("data-state", "active");
          trigger.setAttribute("aria-selected", "true");
          trigger.setAttribute("data-selected", "true");
          trigger.setAttribute("tabindex", "0");
        }, 100);
        trigger.focus();
      }
    }
  }
}
