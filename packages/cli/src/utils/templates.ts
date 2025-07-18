export const CLASS_MERGE_UTIL_TEMPLATE = `import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...args: ClassValue[]) => twMerge(clsx(...args));`;

export const ORBIT_CONFIG_CSS_TEMPLATE = `@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-foreground: var(--foreground);

  --color-primary: var(--primary-color);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-accent: var(--primary-accent);

  --color-secondary: var(--secondary-color);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary-accent: var(--secondary-accent);

  --color-border: var(--border);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-input: var(--input);
  --color-input-border: var(--input-border);
  --color-input-placeholder: var(--input-placeholder);

  --animate-marquee-horizontal: marquee-horizontal var(--duration) infinite linear;
  --animate-marquee-vertical: marquee-vertical var(--duration) infinite linear;

  @keyframes marquee-horizontal {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - var(--gap)));
    }
  }

  @keyframes marquee-vertical {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - var(--gap)));
    }
  }
}

@layer base {
  :root {
    --background: hsl(210 40% 98%);
    --surface: hsl(0 0% 100%);
    --foreground: hsl(222.2 84% 4.9%);

    --primary-color: hsl(160 84% 35%);
    --primary-foreground: hsl(210 40% 98%);
    --primary-accent: hsl(160 84% 30%);

    --secondary-color: hsl(210 40% 95%);
    --secondary-foreground: hsl(215.4 16.3% 46.9%);
    --secondary-accent: hsl(210 40% 90%);

    --border: hsl(0 0% 90%);

    --muted: hsl(210 40% 96.1%);
    --muted-foreground: hsl(215.4 16.3% 46.9%);

    --input: hsl(210 20% 98.04%);
    --input-border: hsl(218.18deg 13.58% 84.12%);
    --input-placeholder: hsl(215.4 16.3% 46.9%);
  }

  .dark {
    --background: hsl(210 30% 8%);
    --surface: hsl(210 30% 10%);
    --foreground: hsl(0 0% 98%);

    --primary-color: hsl(160 100% 60%);
    --primary-foreground: hsl(210 30% 8%);
    --primary-accent: hsl(160 100% 55%);
  
    --secondary-color: hsl(210 30% 15%);
    --secondary-foreground: hsl(0 0% 63.9%);
    --secondary-accent: hsl(210 30% 20%);
  
    --border: hsl(210 30% 20%);

    --muted: hsl(210 30% 15%);
    --muted-foreground: hsl(0 0% 63.9%);

    --input: hsl(217.24 21.17% 26.86%);
    --input-border: hsl(215.38 22.03% 34.71%);
    --input-placeholder: hsl(0 0% 63.9%);
  }
}

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
`;
