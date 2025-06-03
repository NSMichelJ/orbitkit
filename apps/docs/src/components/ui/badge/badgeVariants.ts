import { cva } from "class-variance-authority";

const classBase =
  "inline-flex justify-center items-center gap-1 text-xs font-medium px-2.5 py-0.5";

const badgeVariants = cva(classBase, {
  variants: {
    variant: {
      default: "bg-secondary text-secondary-foreground",
      outline:
        "bg-secondary text-secondary-foreground border-secondary-accent border",
    },
    rounded: {
      none: "rounded-none",
      xs: "rounded-xs",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
    size: {
      xs: "text-xs [&_svg]:size-2.5",
      sm: "text-sm [&_svg]:size-3",
      md: "text-base [&_svg]:size-3",
      lg: "text-lg [&_svg]:size-4",
      xl: "text-xl [&_svg]:size-4",
    },
  },
  defaultVariants: {
    variant: "default",
    rounded: "sm",
    size: "xs",
  },
});

export { badgeVariants };
