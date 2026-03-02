import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#8B949E] uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded border border-[#30363D] bg-[#1C2128] px-3 py-2 text-sm text-[#C9D1D9] placeholder-[#6E7681] transition-colors focus:border-[#58A6FF] focus:outline-none",
          error && "border-[#F85149] focus:border-[#F85149]",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-[#F85149]">{error}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#8B949E] uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={3}
        className={cn(
          "w-full resize-y rounded border border-[#30363D] bg-[#1C2128] px-3 py-2 text-sm text-[#C9D1D9] placeholder-[#6E7681] transition-colors focus:border-[#58A6FF] focus:outline-none",
          error && "border-[#F85149]",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-[#F85149]">{error}</span>}
    </div>
  );
}
