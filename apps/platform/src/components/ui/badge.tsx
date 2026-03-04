import { tv, type VariantProps } from "tailwind-variants";
import type { HTMLAttributes } from "react";

const badgeVariants = tv({
  base: "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium tracking-wide",
  variants: {
    variant: {
      default:     "bg-overlay text-muted border border-border",
      pro:         "bg-overlay text-fg border border-fg/20",
      team:        "bg-overlay text-fg border border-fg/20",
      pending:     "bg-warning-dim text-warning border border-warning/20",
      approved:    "bg-success-dim text-success border border-success/20",
      rejected:    "bg-danger-dim text-danger/60 border border-danger/20 line-through",
      open:        "bg-success-dim text-success border border-success/20",
      full:        "bg-overlay text-faint border border-border",
      category:    "bg-overlay text-muted border border-border",
    },
  },
  defaultVariants: { variant: "default" },
});

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={badgeVariants({ variant, className })} {...props} />;
}
