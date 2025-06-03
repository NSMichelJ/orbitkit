import { cva } from "class-variance-authority";

const baseClass =
  "block w-full p-2.5 mb-2 text-sm rounded-lg outline-1 -outline-offset-1 appearance-none";

const selectVariants = cva(baseClass, {
  variants: {
    variant: {
      default:
        "text-foreground bg-input outline-input-border placeholder-input-placeholder cursor-pointer",
    },
    disabled: {
      false: null,
      true: "bg-input/40 outline-input-border/40 text-muted-foreground cursor-not-allowed",
    },
  },
  compoundVariants: [
    {
      variant: "default",
      disabled: false,
      class: "focus:outline-2 focus:-outline-offset-2 focus:outline-primary",
    },
  ],
  defaultVariants: {
    variant: "default",
    disabled: false,
  },
});

export { selectVariants };
