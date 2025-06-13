import { cva } from "class-variance-authority";

const baseClass =
  "hidden fixed flex-col z-50 p-6 bg-surface text-foreground border-border shadow-sm transform duration-200 transition-all ease-in-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100";

const drawerVariants = cva(baseClass, {
  variants: {
    position: {
      top: "w-full top-0 left-0 border-b data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0 mb-8",
      bottom:
        "w-full bottom-0 left-0 border-t data-[state=closed]:translate-y-full data-[state=open]:translate-y-0 mt-8",
      left: "h-dvh top-0 left-0 border-r data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 mr-8",
      right:
        "h-dvh top-0 right-0 border-l data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 ml-8",
    },
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
      full: "",
    },
  },
  compoundVariants: [
    {
      position: ["left", "right"],
      size: "sm",
      class: "max-w-sm",
    },
    {
      position: ["left", "right"],
      size: "md",
      class: "max-w-md",
    },
    {
      position: ["left", "right"],
      size: "lg",
      class: "max-w-lg",
    },
    {
      position: ["left", "right"],
      size: "xl",
      class: "max-w-xl",
    },
    {
      position: ["left", "right"],
      size: "full",
      class: "w-full",
    },
    {
      position: ["top", "bottom"],
      size: "sm",
      class: "max-h-[var(--container-sm)]",
    },
    {
      position: ["top", "bottom"],
      size: "md",
      class: "max-h-[var(--container-md)]",
    },
    {
      position: ["top", "bottom"],
      size: "lg",
      class: "max-h-[var(--container-lg)]",
    },
    {
      position: ["top", "bottom"],
      size: "xl",
      class: "max-h-[var(--container-xl)]",
    },
    {
      position: ["top", "bottom"],
      size: "full",
      class: "h-dvh",
    },
  ],
  defaultVariants: {
    position: "right",
    size: "sm",
  },
});

export { drawerVariants };
