import { cva } from "class-variance-authority";

const avatarBaseClass =
  "relative inline-flex items-center justify-center size-10 overflow-hidden bg-secondary text-secondary-foreground z-10";

const avatarVariants = cva(avatarBaseClass, {
  variants: {
    variant: {
      circular: "rounded-full",
      square: "rounded-sm",
    },
    bordered: {
      false: null,
      true: "ring-2 ring-border",
    },
  },
  defaultVariants: {
    variant: "circular",
    bordered: false,
  },
});

export { avatarVariants };
