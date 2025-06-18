import { cva } from "class-variance-authority";

const baseClass = [
  "hidden absolute z-50 bg-surface border border-border p-1 rounded-md",
  "transform duration-100 transition-all ease-in data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data[state=open]:opacity-100 data[state=open]:scale-100",
];

const dropdownMenuVariants = cva(baseClass, {
  variants: {
    side: {
      top: "bottom-full mb-(--tooltip-offset)",
      bottom: "top-full mt-(--tooltip-offset)",
      left: "right-full mr-(--tooltip-offset)",
      right: "left-full ml-(--tooltip-offset)",
    },
    alignment: {
      start: "",
      center: "",
      end: "",
    },
  },
  compoundVariants: [
    {
      side: ["top", "bottom"],
      alignment: "start",
      class: "left-0",
    },
    {
      side: ["top", "bottom"],
      alignment: "end",
      class: "left-full -translate-x-full",
    },
    {
      side: ["top", "bottom"],
      alignment: "center",
      class: "left-1/2 -translate-x-1/2",
    },
    {
      side: ["left", "right"],
      alignment: "start",
      class: "top-0 -translate-y-0",
    },
    {
      side: ["left", "right"],
      alignment: "center",
      class: "top-1/2 -translate-y-1/2",
    },
    {
      side: ["left", "right"],
      alignment: "end",
      class: "top-full -translate-y-full",
    },
  ],
  defaultVariants: {
    side: "bottom",
    alignment: "center",
  },
});

const dropdownMenuItemBaseClass =
  "flex justify-between items-center gap-2 px-2 py-1.5 text-sm cursor-default rounded-md outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4";

const dropdownMenuItemVariants = cva(dropdownMenuItemBaseClass, {
  variants: {
    disabled: {
      false: "hover:bg-foreground/5 focus:bg-foreground/5 ",
      true: "opacity-70 pointer-events-none",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

const arrowClass =
  "absolute w-0 h-0 transition-all transform ease-in size-2 bg-surface transform rotate-45 border-border";

const dropdownArrowVariants = cva(arrowClass, {
  variants: {
    side: {
      top: "top-full -mt-1 border-b border-r",
      bottom: "bottom-full -mb-1 border-t border-l",
      left: "left-full -ml-1 border-t border-r",
      right: "right-full -mr-1 border-b border-l",
    },
    alignment: {
      start: "",
      center: "",
      end: "",
    },
  },
  compoundVariants: [
    {
      side: ["top", "bottom"],
      alignment: "start",
      class: "left-0 ml-3 ",
    },
    {
      side: ["top", "bottom"],
      alignment: "end",
      class: "right-0 mr-3",
    },
    {
      side: ["top", "bottom"],
      alignment: "center",
      class: "left-1/2 -translate-x-1/2",
    },
    {
      side: ["left", "right"],
      alignment: "start",
      class: "top-0 mt-3",
    },
    {
      side: ["left", "right"],
      alignment: "center",
      class: "top-1/2 -translate-y-1/2",
    },
    {
      side: ["left", "right"],
      alignment: "end",
      class: "bottom-0 mb-3",
    },
  ],
  defaultVariants: {
    side: "bottom",
    alignment: "center",
  },
});

export {
  dropdownArrowVariants,
  dropdownMenuItemVariants,
  dropdownMenuVariants,
};
