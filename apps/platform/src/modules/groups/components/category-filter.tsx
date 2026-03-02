import { cn } from "../../../lib/utils";
import { CATEGORY_LABELS } from "../../../lib/constants";

const CATEGORIES = ["", ...Object.keys(CATEGORY_LABELS)] as const;

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => {
        const label = cat === "" ? "Semua" : CATEGORY_LABELS[cat];
        const active = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              "px-3 py-1.5 rounded text-xs font-medium transition-all duration-100",
              active
                ? "bg-[#58A6FF] text-[#0D1117]"
                : "bg-[#21262D] border border-[#30363D] text-[#6E7681] hover:border-[#484F58] hover:text-[#C9D1D9]",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
