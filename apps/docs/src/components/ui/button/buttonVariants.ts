import { cva } from "class-variance-authority";

const baseClass =
  "flex justify-center gap-1.5 items-center font-medium cursor-pointer outline-none border [&_svg]:pointer-events-none [&_svg]:shrink-0";

const buttonVariants = cva(baseClass, {
  variants: {
    variant: {
      default: "border-primary text-primary-foreground bg-primary",
      outline: "text-primary  border-primary",
      ghost: "text-primary bg-transparent border-transparent",
      link: "text-foreground border-transparent bg-transparent",
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
      class: "hover:bg-primary-accent hover:border-primary-accent",
    },
    {
      variant: "outline",
      disabled: false,
      class:
        "hover:text-primary-foreground hover:bg-primary-accent hover:border-primary-accent",
    },
    {
      variant: "ghost",
      disabled: false,
      class:
        "hover:bg-primary hover:text-primary-foreground hover:border-primary",
    },
    {
      variant: "link",
      disabled: false,
      class: "hover:text-primary",
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
