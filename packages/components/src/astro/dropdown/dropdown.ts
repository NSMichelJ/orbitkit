export class DowndownMenu {
  // References to tooltip elements
  private dropdownMenu: HTMLElement;
  private trigger: HTMLElement | null;
  private content: HTMLElement | null;
  private menuItems: HTMLElement[] = [];

  constructor(dropowndMenu: HTMLElement) {
    this.dropdownMenu = dropowndMenu;
    this.content = this.dropdownMenu.querySelector("[data-dropdown-content]");
    this.trigger = this.dropdownMenu.querySelector("[data-trigger]");
    this.menuItems = Array.from(
      this.content?.querySelectorAll(
        '[role="menuitem"]:not([data-disabled="true"])',
      ) || [],
    );

    if (!this.content || !this.trigger) {
      console.error("Dropdown not initialized properly", {
        content: this.content,
        trigger: this.trigger,
      });
      return;
    }

    this.init();
  }

  private init() {
    this.setupAccessibility();
    this.setupEventListeners();
  }

  private setupAccessibility() {
    if (!this.trigger || !this.content) return;

    const id =
      this.content.id ||
      `dropdown-id-${Math.random().toString(36).substring(2, 9)}`;
    this.content.id = id;
    this.trigger.setAttribute("aria-describedby", id);
    this.setState("closed");
  }

  private setupEventListeners() {
    if (!this.trigger || !this.content) return;

    this.trigger.addEventListener("click", () => this.toggleDropdown());

    this.content.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const item = target.closest('[role="menuitem"]') as HTMLElement;

      if (item && item.dataset.disabled !== "true") {
        this.closeDropdown();
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (
        this.content &&
        !this.content.contains(target) &&
        target !== this.trigger
      ) {
        this.closeDropdown();
      }
    });

    this.trigger.addEventListener("keydown", (e) => {
      const isOpen = this.content?.dataset.state === "open";
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggleDropdown();
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        this.closeDropdown();
      } else if (isOpen && e.key === "ArrowDown") {
        e.preventDefault();
        this.setFocusItem(0);
      } else if (isOpen && e.key === "ArrowUp") {
        e.preventDefault();
        this.setFocusItem(this.menuItems.length - 1);
      }
    });

    this.menuItems.forEach((menuItem) => {
      menuItem.addEventListener("keydown", (e) =>
        this.handleMenuKeydown(e, menuItem),
      );
    });
    document.addEventListener("keydown", (e) => this.handleKeydown(e));
  }

  private toggleDropdown() {
    if (this.content?.dataset.state === "open") {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  private openDropdown() {
    this.content?.classList.remove("hidden");

    window.setTimeout(() => {
      this.setState("open");
    }, 0);
  }

  private closeDropdown() {
    this.trigger?.focus();
    this.setState("closed");
    window.setTimeout(() => {
      this.content?.classList.add("hidden");
    }, 100);
  }

  private setState(state: "open" | "closed") {
    this.content?.setAttribute("aria-hidden", `${state === "closed"}`);
    this.content?.setAttribute("data-state", state);
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.content!.dataset.state === "open") {
      this.closeDropdown();
      event.preventDefault();
    }
  };

  private handleMenuKeydown(event: KeyboardEvent, item: HTMLElement) {
    const currentItemIndex = this.menuItems.indexOf(item);

    const keyActions: Record<string, () => void> = {
      ArrowDown: () => this.setFocusItem(currentItemIndex + 1),
      ArrowUp: () => this.setFocusItem(currentItemIndex - 1),
      Home: () => this.setFocusItem(0),
      End: () => this.setFocusItem(this.menuItems.length - 1),
      Enter: () => item.click(),
      " ": () => item.click(),
    };

    const action = keyActions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  private setFocusItem(index: number) {
    const newIndex = (index + this.menuItems.length) % this.menuItems.length;

    if (this.menuItems[newIndex]) {
      this.menuItems[newIndex].focus();
    }
  }
}
