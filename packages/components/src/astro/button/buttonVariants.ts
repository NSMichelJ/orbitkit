import { cva } from "class-variance-authority";

const baseClass =
  "inline-flex justify-center gap-1.5 items-center font-medium cursor-pointer outline-none border [&_svg]:pointer-events-none [&_svg]:shrink-0";

const buttonVariants = cva(baseClass, {
  variants: {
    variant: {
      default:
        "border-blue-700 text-white bg-blue-700 dark:border-blue-600 dark:bg-blue-600",
      outline:
        "text-blue-700 border-blue-700 dark:border-blue-500 dark:text-blue-500",
      ghost:
        "text-blue-700 bg-transparent border-transparent dark:text-blue-600",
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
      xs: "px-3 py-2 text-xs [&_svg]:size-3.5",
      sm: "px-3 py-2 text-sm [&_svg]:size-4",
      md: "px-5 py-2.5 text-sm [&_svg]:size-4",
      lg: "px-5 py-3 text-base [&_svg]:size-[18px]",
      xl: "px-6 py-3.5 text-base [&_svg]:size-[18px]",
    },
    disabled: {
      false: null,
      true: ["opacity-50", "cursor-not-allowed"],
    },
  },
  compoundVariants: [
    {
      variant: "default",
      disabled: false,
      class:
        "hover:bg-blue-800 hover:border-blue-800 dark:hover:bg-blue-700 dark:hover:border-blue-700",
    },
    {
      variant: "outline",
      disabled: false,
      class:
        "hover:text-white hover:bg-blue-800 dark:hover:text-white dark:hover:bg-blue-500",
    },
    {
      variant: "ghost",
      disabled: false,
      class:
        "hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 hover:border-blue-700 dark:hover:border-blue-600",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "sm",
    rounded: "lg",
    disabled: false,
  },
});

export default buttonVariants;
