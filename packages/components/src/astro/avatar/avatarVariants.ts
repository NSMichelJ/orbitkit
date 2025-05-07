import { cva } from "class-variance-authority";

const avatarBaseClass =
  "relative inline-flex items-center justify-center size-10 overflow-hidden bg-gray-100  dark:bg-gray-600 z-10";

const avatarVariants = cva(avatarBaseClass, {
  variants: {
    variant: {
      circular: "rounded-full",
      square: "rounded-sm",
    },
    bordered: {
      false: null,
      true: "ring-2 ring-gray-300 dark:ring-gray-500",
    },
  },
  defaultVariants: {
    variant: "circular",
    bordered: false,
  },
});

export { avatarVariants };
