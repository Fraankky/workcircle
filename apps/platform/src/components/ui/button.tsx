import { tv, type VariantProps } from "tailwind-variants";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none",
  variants: {
    variant: {
      primary: "bg-indigo-500 text-white hover:bg-indigo-600 active:opacity-85",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
      ghost: "text-gray-600 hover:bg-gray-100",
      destructive: "bg-gray-900 text-white hover:bg-black",
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
