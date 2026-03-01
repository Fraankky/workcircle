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
    <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-lg min-h-[40px] focus-within:border-indigo-500 transition-colors">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-md"
        >
          #{tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="hover:text-indigo-800 leading-none"
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
          className="flex-1 min-w-[100px] text-xs outline-none bg-transparent placeholder-gray-400"
        />
      )}
    </div>
  );
}
