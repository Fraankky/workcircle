import { useState, type KeyboardEvent } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  max?: number;
}

export function TagInput({ tags, onChange, max = 5 }: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag() {
    const t = input.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t) && tags.length < max) {
      onChange([...tags, t]);
    }
    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-[#30363D] bg-[#1C2128] rounded min-h-[40px] focus-within:border-[#58A6FF] transition-colors">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-0.5 bg-[#1F3558] text-[#58A6FF] border border-[#58A6FF]/30 text-xs rounded"
        >
          #{tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="hover:text-white leading-none"
          >
            ×
          </button>
        </span>
      ))}
      {tags.length < max && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? "Ketik lalu tekan Enter..." : ""}
          className="flex-1 min-w-[100px] text-xs outline-none bg-transparent text-[#C9D1D9] placeholder-[#6E7681]"
        />
      )}
    </div>
  );
}
