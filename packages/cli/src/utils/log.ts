import { highlighted } from "@/utils/highlighted";

export const log = {
  info: (msg: string) => {
    console.log(highlighted.info(msg));
  },
  success: (msg: string) => {
    console.log(highlighted.success(msg));
  },
  warn: (msg: string) => {
    console.log(highlighted.warn(msg));
  },
  error: (msg: string) => {
    console.log(highlighted.error(msg));
  },
  blank: (msg: string) => {
    console.log(msg);
  },
  ln: (n: number = 1) => {
    for (let i = 0; i < n; i++) {
      console.log("");
    }
  },
};
