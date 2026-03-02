import { tv, type VariantProps } from "tailwind-variants";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 font-medium rounded transition-all duration-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none",
  variants: {
    variant: {
      primary:     "bg-[#58A6FF] text-[#0D1117] hover:bg-[#388BFD] active:opacity-85",
      secondary:   "bg-[#21262D] text-[#C9D1D9] border border-[#30363D] hover:bg-[#30363D] hover:border-[#484F58]",
      outline:     "border border-[#30363D] bg-transparent text-[#C9D1D9] hover:bg-[#21262D] hover:border-[#484F58]",
      ghost:       "text-[#8B949E] hover:bg-[#21262D] hover:text-[#C9D1D9]",
      destructive: "bg-[#3D1A1A] text-[#F85149] border border-[#F85149]/30 hover:bg-[#F85149]/20",
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
