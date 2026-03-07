import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../modules/auth/hooks";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { NotificationBell } from "./notification-bell";
import { cn } from "../lib/utils";

const NAV = [
  {
    to: "/discover",
    label: "Discover",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    to: "/groups",
    label: "My Groups",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/spaces",
    label: "Spaces",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "Profil",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
] as const;

export function Sidebar() {
  const { user, logout } = useAuth();
  const { location } = useRouterState();

  if (!user) return null;

  return (
    <aside className="hidden md:flex flex-col w-56 h-screen sticky top-0 border-r border-border bg-overlay backdrop-blur-xl">
      {/* Logo + bell */}
      <div className="px-6 py-8 border-b border-border flex items-center justify-between">
        <span className="text-xl font-bold text-fg tracking-tight">WorkCircle.</span>
        <NotificationBell />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors",
                active
                  ? "bg-overlay text-fg"
                  : "text-muted hover:bg-overlay hover:text-fg",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: upgrade + user */}
      <div className="px-3 pb-8 space-y-3 border-t border-border pt-3">
        {user.plan === "free" && (
          <Link to="/upgrade" className="pb-4">
            <Button size="sm" className="w-full justify-start gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Upgrade ke PRO
            </Button>
          </Link>
        )}

        <div className="flex items-center gap-2.5 px-1 pt-4">
          <Avatar src={user.avatarUrl} name={user.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-fg truncate">{user.name}</p>
            <p className="text-[10px] text-muted uppercase font-medium tracking-wide">{user.plan}</p>
          </div>
          <button
            onClick={logout}
            className="text-muted hover:text-fg transition-colors"
            title="Logout"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
