import type { JoinRequest } from "../types";

interface ActionButtonProps {
  isAdmin: boolean;
  isMember: boolean;
  myRequest: JoinRequest | null;
  isOpen: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export function ActionButton({
  isAdmin,
  isMember,
  myRequest,
  isOpen,
  onJoin,
  onLeave,
}: ActionButtonProps) {
  if (isAdmin) return null;

  if (isMember) {
    return (
      <button
        onClick={onLeave}
        className="shrink-0 text-xs font-medium border border-border text-muted px-3 py-2 rounded hover:bg-overlay hover:text-danger transition-colors"
      >
        Keluar
      </button>
    );
  }

  if (myRequest?.status === "pending") {
    return (
      <span className="shrink-0 text-xs font-medium bg-overlay text-faint px-3 py-2 rounded border border-border">
        Menunggu
      </span>
    );
  }

  if (!isOpen) {
    return (
      <span className="shrink-0 text-xs text-faint px-3 py-2">Penuh</span>
    );
  }

  return (
    <button
      onClick={onJoin}
      className="shrink-0 text-xs font-medium bg-accent text-bg px-3 py-2 rounded hover:bg-accent-glow transition-colors"
    >
      Bergabung
    </button>
  );
}
