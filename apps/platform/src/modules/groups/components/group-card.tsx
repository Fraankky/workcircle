import { Link } from "@tanstack/react-router";
import type { Group } from "../types";
import { Avatar } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { CATEGORY_LABELS } from "../../../lib/constants";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link to="/groups/$id" params={{ id: group.id }}>
      <div className="bg-surface rounded border border-border hover:border-overlay transition-all duration-150 overflow-hidden cursor-pointer">
        {/* Color accent bar */}
        <div className="h-0.5 w-full" style={{ backgroundColor: group.color }} />

        <div className="p-4 space-y-3">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="category">
              {CATEGORY_LABELS[group.category] ?? group.category}
            </Badge>
            <span
              className={`flex items-center gap-1 text-xs font-medium ${
                group.is_open ? "text-success" : "text-faint"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  group.is_open ? "bg-success" : "bg-faint"
                }`}
              />
              {group.is_open ? "Open" : "Full"}
            </span>
          </div>

          {/* Name + description */}
          <div>
            <h3 className="text-sm font-semibold text-fg line-clamp-1">
              {group.name}
            </h3>
            <p className="text-xs text-faint mt-0.5 line-clamp-2 leading-relaxed">
              {group.description}
            </p>
          </div>

          {/* Schedule + location */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-faint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{group.schedule} · {group.time_start}–{group.time_end}</span>
            </div>
            {group.space && (
              <div className="flex items-center gap-1.5 text-xs text-faint">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="truncate">{group.space.name}, {group.space.area}</span>
              </div>
            )}
          </div>

          {/* Footer: admin + member count */}
          <div className="flex items-center justify-between pt-2 border-t border-border-dim">
            <div className="flex items-center gap-1.5">
              <Avatar src={group.admin.avatar_url} name={group.admin.name} size="xs" />
              <span className="text-xs text-muted truncate max-w-[100px]">
                {group.admin.name}
              </span>
            </div>
            <span className="text-xs text-faint font-medium whitespace-nowrap">
              {group.member_count}/{group.max_members}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
