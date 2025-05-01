export const CLASS_MERGE_UTIL_TEMPLATE = `import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...args: ClassValue[]) => twMerge(clsx(...args));`;

export const ORBIT_CONFIG_CSS_TEMPLATE = `@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
}

@layer base {
}
`;
