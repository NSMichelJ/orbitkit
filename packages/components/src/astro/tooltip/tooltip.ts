export class Tooltip {
  // References to tooltip elements
  private tooltip: HTMLElement;
  private trigger: HTMLElement | null;
  private content: HTMLElement | null;

  // Tooltip configuration options
  private duration: number;
  private openDelay: number;
  private closeDelay: number;

  // Timers for managing tooltip open/close/hide delays
  private openTimerId: number | null = null;
  private closeTimerId: number | null = null;
  private hideTimerId: number | null = null;

  constructor(tooltip: HTMLElement) {
    this.tooltip = tooltip;
    this.content = this.tooltip.querySelector("[data-tooltip-content]");
    this.trigger = this.tooltip.querySelector("[data-trigger]");

    this.duration = parseFloat(tooltip.dataset.duration || "200");
    this.openDelay = parseFloat(tooltip.dataset.openDelay || "0");
    this.closeDelay = parseFloat(tooltip.dataset.closeDelay || "0");

    if (!this.tooltip || !this.content || !this.trigger) {
      console.error("Tooltip not initialized properly", {
        container: this.tooltip,
        trigger: this.trigger,
        content: this.content,
      });
      return;
    }

    // If you want to use animations instead of transitions
    // set animation duration instead of transition duration.
    this.content.style.transitionDuration = `${this.duration}ms`;

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
      `tooltip-id-${Math.random().toString(36).substring(2, 9)}`;
    this.content.id = id;
    this.trigger.setAttribute("aria-describedby", id);
    this.setState("closed");
  }

  private setupEventListeners() {
    if (!this.trigger || !this.content) return;

    this.trigger!.addEventListener("mouseenter", () => this.showTooltip());
    this.trigger!.addEventListener("mouseleave", () => this.hideTooltip());
    this.trigger.addEventListener("focus", () => this.showTooltip(true));
    this.trigger.addEventListener("blur", () => this.hideTooltip(true));

    if (this.tooltip.dataset.disableHoverableContent === "false") {
      this.content.addEventListener("mouseenter", () => this.showTooltip());
      this.content.addEventListener("mouseleave", () => this.hideTooltip());
    }

    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  private showTooltip(instant: boolean = false) {
    this.clearCloseTimer();
    this.content?.classList.remove("hidden");

    if (instant) {
      this.setState("open");
      return;
    }

    this.openTimerId = window.setTimeout(() => {
      this.setState("open");
      this.openTimerId = null;
    }, this.openDelay);
  }

  private hideTooltip(instant: boolean = false) {
    this.clearOpenTimer();

    if (instant) {
      this.setState("closed");
      this.content?.classList.add("hidden");
      return;
    }

    this.closeTimerId = window.setTimeout(() => {
      this.setState("closed");
      this.hideTimerId = window.setTimeout(() => {
        this.content?.classList.add("hidden");
        this.closeTimerId = null;
        this.hideTimerId = null;
      }, this.duration);
    }, this.closeDelay);
  }

  private setState(state: "open" | "closed") {
    this.content?.setAttribute("aria-hidden", `${state === "closed"}`);
    this.content?.setAttribute("data-state", state);
  }

  private clearOpenTimer() {
    if (this.openTimerId) {
      window.clearTimeout(this.openTimerId);
      this.openTimerId = null;
    }
  }

  private clearCloseTimer() {
    if (this.closeTimerId) {
      window.clearTimeout(this.closeTimerId);
      this.closeTimerId = null;
    }
    if (this.hideTimerId) {
      window.clearTimeout(this.hideTimerId);
      this.hideTimerId = null;
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.content!.dataset.status === "open") {
      this.hideTooltip(true);
      event.preventDefault();
    }
  };
}
