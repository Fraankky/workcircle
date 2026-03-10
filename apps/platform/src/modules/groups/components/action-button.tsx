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

  if (myRequest?.status === "rejected") {
    return (
      <div className="shrink-0 text-right space-y-1">
        <span className="text-xs font-medium bg-danger/10 text-danger px-3 py-2 rounded border border-danger/20 block">
          Ditolak
        </span>
        {myRequest.rejection_reason && (
          <p className="text-[10px] text-faint max-w-36 leading-tight">{myRequest.rejection_reason}</p>
        )}
      </div>
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
