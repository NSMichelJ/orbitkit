import { cva } from "class-variance-authority";

const baseClass = [
  "hidden absolute z-50 px-3 py-1.5 whitespace-nowrap bg-foreground text-background rounded-md text-sm backdrop-blur-sm max-w-xs",
  "transform transition-all ease-in data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data[state=open]:opacity-100 data[state=open]:scale-100",
];

const tooltipVariants = cva(baseClass, {
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
    side: "top",
    alignment: "center",
  },
});

const arrowClass =
  "absolute w-0 h-0 transition-all transform ease-in size-2 bg-foreground transform rotate-45";

const tooltipArrowVariants = cva(arrowClass, {
  variants: {
    side: {
      top: "top-full -mt-1 ",
      bottom: "bottom-full -mb-1",
      left: "left-full -ml-1",
      right: "right-full -mr-1",
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
    side: "top",
    alignment: "center",
  },
});

export { tooltipArrowVariants, tooltipVariants };
