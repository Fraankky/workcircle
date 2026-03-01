import { tv, type VariantProps } from "tailwind-variants";
import type { HTMLAttributes } from "react";

const badgeVariants = tv({
  base: "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
  variants: {
    variant: {
      default: "bg-gray-100 text-gray-600",
      pro: "bg-indigo-500 text-white",
      team: "bg-gray-900 text-white",
      pending: "bg-gray-100 text-gray-500",
      approved: "bg-gray-900 text-white",
      rejected: "bg-gray-100 text-gray-400 line-through",
      open: "bg-indigo-50 text-indigo-600",
      full: "bg-gray-100 text-gray-400",
      category: "bg-indigo-50 text-indigo-600",
    },
  },
  defaultVariants: { variant: "default" },
});

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={badgeVariants({ variant, className })} {...props} />;
}
