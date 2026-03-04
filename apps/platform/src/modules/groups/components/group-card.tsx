import { Link } from "@tanstack/react-router";
import type { Group } from "../types";
import { Avatar } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { CATEGORY_LABELS } from "../../../lib/constants";
import { CalendarIcon, LocationIcon } from "./icons";

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
              <CalendarIcon />
              <span>{group.schedule} · {group.time_start}–{group.time_end}</span>
            </div>
            {group.space && (
              <div className="flex items-center gap-1.5 text-xs text-faint">
                <LocationIcon />
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
