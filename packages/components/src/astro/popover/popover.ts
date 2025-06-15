export class Popover {
  // References to tooltip elements
  private dropdownMenu: HTMLElement;
  private trigger: HTMLElement | null;
  private content: HTMLElement | null;

  constructor(dropowndMenu: HTMLElement) {
    this.dropdownMenu = dropowndMenu;
    this.content = this.dropdownMenu.querySelector("[data-popover-content]");
    this.trigger = this.dropdownMenu.querySelector("[data-trigger]");

    if (!this.content || !this.trigger) {
      console.error("Popover not initialized properly", {
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
      `popover-id-${Math.random().toString(36).substring(2, 9)}`;
    this.content.id = id;
    this.trigger.setAttribute("aria-describedby", id);
    this.setState("closed");
  }

  private setupEventListeners() {
    if (!this.trigger || !this.content) return;

    this.trigger.addEventListener("click", () => this.popoverToggle());

    this.content.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const item = target.closest('[role="menuitem"]') as HTMLElement;

      if (item && item.dataset.disabled !== "true") {
        this.closePopover();
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (
        this.content &&
        !this.content.contains(target) &&
        target !== this.trigger
      ) {
        this.closePopover();
      }
    });

    this.trigger.addEventListener("keydown", (e) => {
      const isOpen = this.content?.dataset.state === "open";
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.popoverToggle();
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        this.closePopover();
      }
    });

    document.addEventListener("keydown", (e) => this.handleKeydown(e));
  }

  private popoverToggle() {
    if (this.content?.dataset.state === "open") {
      this.closePopover();
    } else {
      this.openPopover();
    }
  }

  private openPopover() {
    this.content?.classList.remove("hidden");

    window.setTimeout(() => {
      this.setState("open");
    }, 0);
  }

  private closePopover() {
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
      this.closePopover();
      event.preventDefault();
    }
  };
}
