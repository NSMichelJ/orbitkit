import { cva } from "class-variance-authority";

const baseClass = "flex flex-col bg-surface text-foreground overflow-hidden";

const listVariants = cva(baseClass, {
  variants: {
    outerBorder: {
      true: "border  border-border",
      false: null,
    },
    innerBorders: {
      true: "divide-y divide-border",
      false: null,
    },
    rounded: {
      none: "rounded-none",
      xs: "rounded-xs",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
  },
  defaultVariants: {
    outerBorder: true,
    innerBorders: true,
    rounded: "lg",
  },
});

const listItemBaseClass =
  "px-4 py-2 flex items-center justify-between text-base text-start";

const listItemVariants = cva(listItemBaseClass, {
  variants: {
    active: {
      true: "bg-foreground/5",
      false: null,
    },
    disabled: {
      false: null,
      true: "opacity-50 cursor-not-allowed",
    },
    rounded: {
      none: "rounded-none",
      xs: "rounded-xs",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
  },
  compoundVariants: [
    {
      disabled: false,
      class: "hover:bg-foreground/5 focus:outline-none",
    },
  ],
  defaultVariants: {
    disabled: false,
    rounded: "none",
  },
});

export { listItemVariants, listVariants };
