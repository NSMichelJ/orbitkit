import { toastIcons } from "./assets";

export interface ToastDomElements {
  title: HTMLElement | null;
  description: HTMLElement | null;
  dismissibleButton: HTMLElement | null;
  iconContainer: HTMLElement | null;
  closeButtons: NodeListOf<HTMLElement>;
}

export type ToastPosition =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left";

export type ToastType = "default" | "success" | "error" | "warning" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
  autoClose?: boolean;
  type?: ToastType;
  onClose?: () => void;
}

const DEFAULT_DURATION = 3000;
const DEFAULT_MAX_VISIBLE_TOASTS = 3;
const DEFAULT_OFFSET = 24;
const DEFAULT_GAP = 16;
const DEFAULT_POSITION: ToastPosition = "bottom-right";
const DEFAULT_TOAST_TYPE: ToastType = "default";

export class Toast {
  private static instances: HTMLElement[] = [];

  private opts: ToastOptions;
  private toaster: HTMLElement | null;
  private toast: HTMLElement | null;
  private elements: ToastDomElements;

  private duration: number;
  private startTime: number = 0;
  private remainingTime: number = 0;
  private timeoutId: number | null = null;
  private position: ToastPosition;
  private dismissible: boolean;
  private autoClose: boolean;

  private maxVisibleToasts: number;
  private offset: number;
  private gap: number;

  constructor(opts: ToastOptions) {
    this.opts = opts;

    this.toaster = document.querySelector("[data-toaster]");
    if (!this.toaster) {
      throw new Error(
        "Toaster container with 'data-toaster' attribute not found in the document.",
      );
    }

    this.toast = this.getTemplate().querySelector(
      "[data-toast]",
    ) as HTMLElement;
    if (!this.toast) {
      throw new Error("Toast element with 'data-toast' not found in template.");
    }

    this.elements = {
      title: this.toast.querySelector("[data-toast-title]"),
      description: this.toast.querySelector("[data-toast-description]"),
      iconContainer: this.toast.querySelector("[data-toast-icon]"),
      closeButtons: this.toast.querySelectorAll("[data-close]") ?? [],
      dismissibleButton: this.toast.querySelector("[data-dismissible-button]"),
    };

    this.gap = parseInt(this.toaster.dataset.gap ?? `${DEFAULT_GAP}`, 10);
    this.maxVisibleToasts = parseInt(
      this.toaster.dataset.visibleToasts ?? `${DEFAULT_MAX_VISIBLE_TOASTS}`,
      10,
    );
    this.offset = parseInt(
      this.toaster.dataset.offset ?? `${DEFAULT_OFFSET}`,
      10,
    );
    this.position =
      (this.toaster?.dataset.position as typeof this.position) ??
      DEFAULT_POSITION;
    this.duration =
      this.opts.duration ??
      parseInt(this.toaster.dataset.duration ?? `${DEFAULT_DURATION}`);
    this.dismissible =
      this.opts.dismissible ?? this.toaster.dataset.dismissible === "true";
    this.autoClose =
      this.opts.autoClose ?? this.toaster.dataset.autoClose === "true";

    this.init();
  }

  private init() {
    this.initializeToastContent();
    this.calculateInitialPosition();
    this.setupAccessibility();
    this.setupEventListeners();
    this.showToast();
  }

  private setupAccessibility() {
    if (this.toast) {
      this.toast.setAttribute("role", "alert");
      this.toast.setAttribute("aria-live", "assertive");
      this.toast.setAttribute("aria-atomic", "true");
    }
  }

  private initializeToastContent() {
    this.toast!.setAttribute(
      "data-toast-type",
      this.opts.type ?? DEFAULT_TOAST_TYPE,
    );

    if (this.elements.iconContainer) {
      const iconType = toastIcons[this.opts.type ?? DEFAULT_TOAST_TYPE];
      if (iconType) {
        this.elements.iconContainer.innerHTML = iconType;
      } else {
        this.elements.iconContainer.remove();
        this.elements.iconContainer = null;
      }
    }

    if (this.elements.title) {
      this.elements.title.textContent = this.opts.title;
    } else {
      console.warn(
        "Toast title element not found. Title might not be displayed.",
      );
    }

    if (this.opts.description && this.elements.description) {
      this.elements.description.textContent = this.opts.description;
    } else if (this.elements.description) {
      this.elements.description.remove();
      this.elements.description = null;
    }

    if (!this.dismissible && this.elements.dismissibleButton) {
      this.elements.dismissibleButton.remove();
      this.elements.dismissibleButton = null;
    }
  }

  private setupEventListeners() {
    this.elements.closeButtons.forEach((trigger) => {
      trigger.addEventListener("click", () => this.removeToast());
    });
    this.toaster!.addEventListener("mouseenter", () => this.handleMouseEnter());
    this.toaster!.addEventListener("mouseleave", () => this.handleMouseLeave());
  }

  private showToast() {
    this.toaster?.insertAdjacentElement("afterbegin", this.toast!);
    Toast.instances.unshift(this.toast!);
    this.adjustToastPositions();
    this.setState(this.toast!, "showing");

    if (this.autoClose) {
      this.startTime = Date.now();
      this.remainingTime = this.duration;
      this.timeoutId = window.setInterval(() => {
        this.removeToast();
        this.opts.onClose?.();
      }, this.duration);
    }
  }

  private removeToast() {
    this.setState(this.toast!, "hide");
    const index = Toast.instances.indexOf(this.toast!);
    if (index !== -1) {
      Toast.instances.splice(index, 1);
    }
    this.adjustToastPositions();

    setTimeout(() => {
      this.toast?.remove();
      this.opts.onClose?.();
    }, 500);
  }

  private adjustToastPositions() {
    const isButtom = this.position.startsWith("bottom");
    let accumulatedHeight = this.offset;

    Toast.instances.forEach((currentToast, index) => {
      accumulatedHeight += currentToast.offsetHeight;
      const verticalOffset = accumulatedHeight + index * this.gap;

      const sign = isButtom ? -1 : 1;
      const translateYValue =
        sign * (verticalOffset - currentToast.offsetHeight);

      let translateXValue = "";
      if (this.position.endsWith("center")) {
        translateXValue = "translateX(-50%)";
      }

      currentToast.style.transform = `${translateXValue} translateY(${translateYValue}px)`;

      this.setState(
        currentToast,
        index < this.maxVisibleToasts ? "showing" : "hide",
      );
    });
  }

  private handleMouseEnter() {
    if (!this.autoClose) return;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      const elapsedTime = Date.now() - this.startTime;
      this.remainingTime = Math.max(0, this.remainingTime - elapsedTime);
      this.timeoutId = null;
    }
  }

  private handleMouseLeave() {
    if (!this.autoClose) return;
    if (this.remainingTime > 0) {
      this.startTime = Date.now();
      this.timeoutId = window.setTimeout(
        () => this.removeToast(),
        this.remainingTime,
      );
    } else {
      this.removeToast();
    }
  }

  private calculateInitialPosition() {
    const [y, x] = this.position.split("-");

    if (y === "top") {
      this.toast!.style.top = `0px`;
    } else {
      this.toast!.style.bottom = `0px`;
    }

    if (x === "left") {
      this.toast!.style.left = `${this.offset}px`;
    } else if (x === "center") {
      this.toast!.style.left = "50%";
      this.toast!.style.transform = "translateX(-50%)";
    } else {
      this.toast!.style.right = `${this.offset}px`;
    }
  }

  private setState(toast: HTMLElement, state: "showing" | "hide") {
    toast.setAttribute("data-state", state);
  }

  private getTemplate() {
    const toastTemplate =
      this.toaster?.querySelector<HTMLTemplateElement>("#toast-template");
    if (!toastTemplate) {
      throw new Error("Toast template not found in the document.");
    }
    return toastTemplate.content.cloneNode(true) as DocumentFragment;
  }
}
