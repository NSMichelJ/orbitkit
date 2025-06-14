interface AccordionItem extends HTMLElement {
  trigger?: HTMLElement;
  content?: HTMLElement;
}

export class Accordion {
  private wrapper: HTMLElement;
  private items: NodeListOf<HTMLElement> | null;

  constructor(accordionWrapper: HTMLElement) {
    this.wrapper = accordionWrapper;
    this.items = this.wrapper.querySelectorAll("[data-accordion-item]");

    this.init();
  }

  private init() {
    this.items?.forEach((item: AccordionItem) => {
      const trigger = item.querySelector<HTMLElement>(
        "[data-accordion-trigger]",
      );
      const content = item.querySelector<HTMLElement>(
        "[data-accordion-content]",
      );

      if (trigger && content) {
        item.trigger = trigger;
        item.content = content;

        this.setupAccessibility(item);
        this.setupEventListeners(item);
      }
    });
  }

  private setupAccessibility(item: AccordionItem) {
    if (item.trigger && item.content) {
      const triggerId =
        item.trigger.id ||
        `accordion-id-${Math.random().toString(36).substring(2, 9)}`;
      const contentId =
        item.content.id ||
        `accordion-id-${Math.random().toString(36).substring(2, 9)}`;

      item.trigger.id = triggerId;
      item.trigger.setAttribute("aria-controls", contentId);

      item.content.id = contentId;
      item.content.setAttribute("aria-labelledby", triggerId);
      item.content.setAttribute("role", "region");

      this.setState(item, "closed");
    }
  }

  private setupEventListeners(item: AccordionItem) {
    if (!item.trigger && !item.content) return;

    item.trigger?.addEventListener("click", () =>
      this.toggleAccordionItem(item),
    );
    item.trigger?.addEventListener("keydown", (e) =>
      this.handleKeydown(e, item),
    );
  }

  private toggleAccordionItem(item: AccordionItem) {
    if (item.trigger?.getAttribute("aria-expanded") === "true") {
      this.closeAccordionItem(item);
    } else {
      if (this.wrapper.dataset.multiple !== "true") {
        this.closeAllContents();
      }
      this.openAccordionItem(item);
    }
  }

  private openAccordionItem(item: AccordionItem) {
    this.setState(item, "open");
    const height = item.content?.scrollHeight + "px";
    item.content!.style.maxHeight = height;
  }

  private closeAccordionItem(item: AccordionItem) {
    this.setState(item, "closed");
    item.content!.style.maxHeight = "0px";
  }

  private closeAllContents() {
    this.items?.forEach((item) => {
      this.closeAccordionItem(item);
    });
  }

  private handleKeydown(event: KeyboardEvent, item: AccordionItem) {
    const items = Array.from(this.items || []);
    const currentItemIndex = items.indexOf(item);

    const keyActions: Record<string, () => void> = {
      ArrowDown: () => this.setFocusItem(items, currentItemIndex + 1),
      ArrowUp: () => this.setFocusItem(items, currentItemIndex - 1),
      Home: () => this.setFocusItem(items, 0),
      End: () => this.setFocusItem(items, items.length - 1),
    };

    const action = keyActions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  private setFocusItem(items: AccordionItem[], index: number) {
    const newIndex = index % items.length;
    if (items[newIndex].trigger) {
      items[newIndex].trigger.focus();
    }
  }

  private setState(item: AccordionItem, state: "closed" | "open") {
    item.trigger?.setAttribute("data-state", state);
    item.trigger?.setAttribute("aria-expanded", `${state === "open"}`);
    item.content?.setAttribute("data-state", state);
  }
}
