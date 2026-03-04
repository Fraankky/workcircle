import { tv, type VariantProps } from "tailwind-variants";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 font-medium rounded transition-all duration-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none",
  variants: {
    variant: {
      primary:     "bg-fg text-bg hover:opacity-85 active:opacity-75",
      secondary:   "bg-overlay text-fg border border-border hover:bg-surface-2",
      outline:     "border border-border bg-transparent text-fg hover:bg-overlay",
      ghost:       "text-muted hover:bg-overlay hover:text-fg",
      destructive: "bg-danger-dim text-danger border border-danger/30 hover:bg-danger/20",
    },
    size: {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-sm px-5 py-2.5",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonVariants({ variant, size, className })} {...props} />;
}
