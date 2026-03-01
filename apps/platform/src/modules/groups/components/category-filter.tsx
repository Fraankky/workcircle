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
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-100",
              active
                ? "bg-indigo-500 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
