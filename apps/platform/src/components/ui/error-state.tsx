interface ErrorStateProps {
  message: string;
  retry?: boolean;
  padding?: string;
}

export function ErrorState({ message, retry = true, padding = "py-16" }: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${padding} text-center`}>
      <p className="text-sm text-faint">{message}</p>
      {retry && (
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs text-fg hover:underline"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-medium text-faint">{message}</p>
      {hint && <p className="text-xs text-faint/70 mt-1">{hint}</p>}
    </div>
  );
}
