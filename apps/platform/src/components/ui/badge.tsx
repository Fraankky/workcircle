import { tv, type VariantProps } from "tailwind-variants";
import type { HTMLAttributes } from "react";

const badgeVariants = tv({
  base: "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium tracking-wide",
  variants: {
    variant: {
      default:     "bg-[#21262D] text-[#8B949E] border border-[#30363D]",
      pro:         "bg-[#1F3558] text-[#58A6FF] border border-[#58A6FF]/30",
      team:        "bg-[#1A3A21] text-[#3FB950] border border-[#3FB950]/30",
      pending:     "bg-[#3A2D10] text-[#D29922] border border-[#D29922]/30",
      approved:    "bg-[#1A3A21] text-[#3FB950] border border-[#3FB950]/30",
      rejected:    "bg-[#3D1A1A] text-[#F85149]/60 border border-[#F85149]/20 line-through",
      open:        "bg-[#1A3A21] text-[#3FB950] border border-[#3FB950]/30",
      full:        "bg-[#21262D] text-[#6E7681] border border-[#30363D]",
      category:    "bg-[#1F3558] text-[#58A6FF] border border-[#58A6FF]/30",
    },
  },
  defaultVariants: { variant: "default" },
});

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={badgeVariants({ variant, className })} {...props} />;
}
