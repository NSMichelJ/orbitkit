export class Collapsible {
  private wrapper: HTMLElement;
  private content: HTMLElement | null;
  private trigger: HTMLElement | null;

  constructor(collapsibleWrapper: HTMLElement) {
    this.wrapper = collapsibleWrapper;
    this.content = this.wrapper.querySelector("[data-collapsible-content]");
    this.trigger = this.wrapper.querySelector("[data-trigger]");

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
      `collapsible-id-${Math.random().toString(36).substring(2, 9)}`;

    this.content.id = id;
    this.trigger.setAttribute("aria-controls", id);

    if (this.wrapper.dataset.open === "true") {
      this.setState("open");
      this.content?.removeAttribute("hidden");
      const height = this.content?.scrollHeight + "px";
      this.content!.style.maxHeight = height;
    } else {
      this.setState("closed");
      this.content?.setAttribute("hidden", "");
      this.content!.style.maxHeight = "0px";
    }
  }

  private setupEventListeners() {
    this.trigger?.addEventListener("click", () => this.toggleCollapsible());
    this.trigger?.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  private toggleCollapsible() {
    if (this.trigger?.dataset.state === "open") {
      this.closeCollapsible();
    } else {
      this.openCollapsible();
    }
  }

  private openCollapsible() {
    this.content?.removeAttribute("hidden");
    this.setState("open");
    const height = this.content?.scrollHeight + "px";
    this.content!.style.maxHeight = height;
  }

  private closeCollapsible() {
    this.setState("closed");
    this.content!.style.maxHeight = "0px";
    window.setTimeout(() => {
      this.content?.setAttribute("hidden", "");
    }, 300);
  }

  private setState(state: "closed" | "open") {
    this.trigger?.setAttribute("data-state", state);
    this.trigger?.setAttribute("aria-expanded", `${state === "open"}`);
    this.content?.setAttribute("data-state", state);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.content!.dataset.status === "open") {
      this.closeCollapsible();
      event.preventDefault();
    }
  };
}
