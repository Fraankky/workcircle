import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../modules/auth/hooks";
import { Avatar } from "./ui/avatar";

export function Header() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-bg border-b border-border flex items-center justify-between px-4">
      <span className="text-sm font-bold text-acccent tracking-tight">WorkCircle</span>
      <div className="flex items-center gap-2">
        {user && <Avatar src={user.avatarUrl} name={user.name} size="xs" />}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-1.5 text-faint hover:text-fg transition-colors"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-surface border-b border-border py-2">
          {[
            { to: "/discover", label: "Discover" },
            { to: "/groups", label: "My Groups" },
            { to: "/spaces", label: "Spaces" },
            { to: "/profile", label: "Profil" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 text-sm text-muted hover:bg-[#21262D] hover:text-fg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
