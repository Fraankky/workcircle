export function MapPlaceholder() {
  return (
    <div className="w-full h-full bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 select-none">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-300"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <p className="text-xs text-gray-400 font-medium">Peta akan segera hadir</p>
    </div>
  );
}
