import { Link } from "@tanstack/react-router";

interface BackLinkProps {
  to: string;
  label?: string;
  className?: string;
}

export function BackLink({ to, label = "Kembali", className }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1 text-xs text-faint hover:text-fg transition-colors ${className ?? ""}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      {label}
    </Link>
  );
}
