import { cva } from "class-variance-authority";

const baseClass =
  "inline-flex justify-center gap-1.5 items-center rounded-lg font-medium cursor-pointer outline-none whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0";

const paginationLinkVariants = cva(baseClass, {
  variants: {
    isActive: {
      true: "border border-border",
      false: "hover:bg-foreground/5",
    },
    size: {
      xs: "px-3 py-2 text-xs [&_svg]:size-3.5",
      sm: "px-3 py-2 text-sm [&_svg]:size-4",
      md: "px-5 py-2.5 text-sm [&_svg]:size-4",
      lg: "px-5 py-3 text-base [&_svg]:size-[18px]",
      xl: "px-6 py-3.5 text-base [&_svg]:size-[18px]",
    },
  },
  defaultVariants: {
    size: "sm",
    isActive: false,
  },
});

export { paginationLinkVariants };
