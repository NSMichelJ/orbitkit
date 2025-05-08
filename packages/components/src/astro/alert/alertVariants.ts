import { cva } from "class-variance-authority";

const baseClass = "flex justify-start gap-y-1 gap-x-2 flex-wrap w-full";

const alertVariants = cva(baseClass, {
  variants: {
    variant: {
      default: "bg-surface border-border text-foreground",
      info: " text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800",
      danger:
        "text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800",
      success:
        "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800",
      warning:
        "text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800",
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
      xs: "p-3 text-xs",
      sm: "p-3 text-sm",
      md: "p-4 text-sm",
      lg: "p-5 text-base",
      xl: "p-5 text-lg",
    },
    direction: {
      row: "flex-row",
      col: "flex-col",
    },
    border: {
      false: null,
      true: "border",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
    rounded: "lg",
    direction: "col",
    border: true,
  },
});

export { alertVariants };
