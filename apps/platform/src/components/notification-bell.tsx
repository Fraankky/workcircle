import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNotifications } from "../modules/notifications/hooks/use-notifications";

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleBellClick() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: Math.max(8, rect.right - 320),
      });
    }
    setOpen((v) => !v);
  }

  function handleNotifClick(id: string, linkUrl: string | null) {
    markRead(id);
    setOpen(false);
    if (linkUrl) navigate({ to: linkUrl });
  }

  function handleMarkAllRead() {
    markAllRead();
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        onClick={handleBellClick}
        className="relative p-1.5 text-muted hover:text-fg transition-colors"
        aria-label="Notifikasi"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-danger text-bg text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed w-80 border border-border rounded shadow-2xl z-9999 overflow-hidden"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            background: "#0E0E12",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold text-fg">Notifikasi</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] text-muted hover:text-fg transition-colors"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-xs text-faint">Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotifClick(n.id, n.link_url)}
                  className={`w-full text-left px-4 py-3 border-b border-border-dim hover:bg-surface transition-colors ${
                    !n.is_read ? "bg-accent-dim" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <NotifTypeIcon type={n.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-fg leading-snug">{n.title}</p>
                      <p className="text-[11px] text-muted mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-faint mt-1">
                        {formatTime(n.created_at)}
                      </p>
                    </div>
                    {!n.is_read && (
                      <div className="w-1.5 h-1.5 rounded-full bg-ascent shrink-0 mt-1" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function NotifTypeIcon({ type }: { type: string }) {
  if (type === "join_approved") {
    return (
      <div className="w-6 h-6 rounded-full bg-success-dim flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (type === "join_rejected") {
    return (
      <div className="w-6 h-6 rounded-full bg-danger-dim flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-danger">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-overlay flex items-center justify-center shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
  );
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} mnt lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}
