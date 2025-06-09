export class Modal {
  private wrapper: HTMLElement;
  private modal: HTMLElement | null;
  private trigger: HTMLElement | null;
  private backdrop: HTMLElement | null;
  private closeButtons: NodeListOf<HTMLElement> | null;

  constructor(wrapper: HTMLElement) {
    this.wrapper = wrapper;
    this.modal = this.wrapper.querySelector<HTMLElement>("[data-modal]");
    this.backdrop = this.wrapper.querySelector<HTMLElement>("[data-backdrop]");
    this.trigger = this.wrapper.firstElementChild as HTMLElement;

    // Ensure trigger is not the modal or backdrop
    while (this.trigger === this.modal || this.trigger === this.backdrop) {
      this.trigger = this.trigger.nextElementSibling as HTMLElement;
      if (!this.trigger) break;
    }

    this.closeButtons =
      this.wrapper.querySelectorAll<HTMLElement>("[data-close-modal]");

    if (!this.modal || !this.trigger) {
      console.error("Modal not initialized properly", {
        modal: this.modal,
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
    const title = this.modal?.querySelector<HTMLElement>(
      "h1, h2, h3, h4, h5, h6",
    );

    if (title) {
      const id =
        title.id || `modal-id-${Math.random().toString(36).substring(2, 9)}`;
      title.id = id;
      this.modal?.setAttribute("aria-describedby", id);
    }

    this.setState("closed");
  }

  private setupEventListeners() {
    this.trigger!.addEventListener("click", () => this.open());

    if (this.modal?.dataset.allowOutsideClick === "true") {
      this.backdrop?.addEventListener("click", () => this.closeModal());
      document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (
          this.modal &&
          !this.modal.contains(target) &&
          target !== this.trigger
        ) {
          this.closeModal();
        }
      });
    }

    this.closeButtons?.forEach((trigger) => {
      trigger.addEventListener("click", () => this.closeModal());
    });

    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  private open() {
    this.backdrop?.classList.remove("hidden");
    this.modal?.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    setTimeout(() => {
      this.setState("open");
    }, 0);
  }

  private closeModal() {
    this.setState("closed");
    setTimeout(() => {
      this.backdrop?.classList.add("hidden");
      this.modal?.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 200);
  }

  private setState(state: "open" | "closed") {
    this.trigger?.focus();
    this.modal?.setAttribute("aria-hidden", `${state === "closed"}`);
    this.modal?.setAttribute("data-state", state);
    this.backdrop?.setAttribute("aria-hidden", `${state === "closed"}`);
    this.backdrop?.setAttribute("data-state", state);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.modal!.dataset.status === "open") {
      this.closeModal();
      event.preventDefault();
    }
  };
}
