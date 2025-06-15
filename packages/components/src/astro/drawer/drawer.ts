export class Drawer {
  private wrapper: HTMLElement;
  private drawer: HTMLElement | null;
  private trigger: HTMLElement | null;
  private backdrop: HTMLElement | null;
  private closeButtons: NodeListOf<HTMLElement> | null;

  constructor(drawerWrraper: HTMLElement) {
    this.wrapper = drawerWrraper;
    this.drawer = this.wrapper.querySelector("[data-drawer-content]");
    this.backdrop = this.wrapper.querySelector("[data-drawer-backdrop]");
    this.trigger = this.wrapper.querySelector("[data-trigger]");
    this.closeButtons = this.wrapper.querySelectorAll<HTMLElement>(
      "[data-close-drawer]",
    );

    if (!this.drawer || !this.trigger) {
      console.error("Drawer not initialized properly", {
        drawer: this.drawer,
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
    const title = this.drawer?.querySelector<HTMLElement>(
      "h1, h2, h3, h4, h5, h6",
    );

    if (title) {
      const id =
        title.id || `drawer-id-${Math.random().toString(36).substring(2, 9)}`;
      title.id = id;
      this.drawer?.setAttribute("aria-describedby", id);
    }

    this.setState("closed");
  }

  private setupEventListeners() {
    this.trigger!.addEventListener("click", () => this.openDrawer());

    if (this.drawer?.dataset.allowOutsideClick === "true") {
      this.backdrop?.addEventListener("click", () => this.closeDrawer());
      document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (
          this.drawer &&
          !this.drawer.contains(target) &&
          target !== this.trigger
        ) {
          this.closeDrawer();
        }
      });
    }

    this.closeButtons?.forEach((trigger) => {
      trigger.addEventListener("click", () => this.closeDrawer());
    });

    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  private openDrawer() {
    this.backdrop?.classList.remove("hidden");
    this.drawer?.classList.replace("hidden", "flex");

    document.body.classList.add("overflow-hidden");
    setTimeout(() => {
      this.setState("open");
    }, 0);
  }

  private closeDrawer() {
    this.setState("closed");
    setTimeout(() => {
      this.backdrop?.classList.add("hidden");
      this.drawer?.classList.replace("flex", "hidden");
      document.body.classList.remove("overflow-hidden");
    }, 200);
  }

  private setState(state: "open" | "closed") {
    this.trigger?.focus();
    this.drawer?.setAttribute("aria-hidden", `${state === "closed"}`);
    this.drawer?.setAttribute("data-state", state);
    this.backdrop?.setAttribute("aria-hidden", `${state === "closed"}`);
    this.backdrop?.setAttribute("data-state", state);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.drawer!.dataset.status === "open") {
      this.closeDrawer();
      event.preventDefault();
    }
  };
}
