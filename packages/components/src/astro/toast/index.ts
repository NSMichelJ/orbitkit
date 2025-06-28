import { toastIcons } from "./assets";
import type {
  ToastDomElements,
  ToastOptions,
  ToastPosition,
  ToastType,
} from "./toast";
import { Toast as ToastHandler } from "./toast";
import Toast from "./Toast.astro";
import ToastDescription from "./ToastDescription.astro";
import ToastTitle from "./ToastTitle.astro";

export { Toast, ToastDescription, ToastHandler, toastIcons, ToastTitle };
export type { ToastDomElements, ToastOptions, ToastPosition, ToastType };

export const toast = Object.assign(
  (opts: ToastOptions) => new ToastHandler(opts),
  {
    success: (opts: Omit<ToastOptions, "type">) =>
      new ToastHandler({ ...opts, type: "success" }),
    error: (opts: Omit<ToastOptions, "type">) =>
      new ToastHandler({ ...opts, type: "error" }),
    warning: (opts: Omit<ToastOptions, "type">) =>
      new ToastHandler({ ...opts, type: "warning" }),
    info: (opts: Omit<ToastOptions, "type">) =>
      new ToastHandler({ ...opts, type: "info" }),
    default: (opts: Omit<ToastOptions, "type">) =>
      new ToastHandler({ ...opts, type: "default" }),
  },
);
