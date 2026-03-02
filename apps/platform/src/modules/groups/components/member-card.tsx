import { Avatar } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import type { GroupMember } from "../types";

interface MemberCardProps {
  member: GroupMember;
  canKick: boolean;
  onKick: (userId: string) => void;
}

export function MemberCard({ member, canKick, onKick }: MemberCardProps) {
  const { user, role } = member;

  return (
    <div className="flex items-center justify-between p-3 rounded bg-[#1C2128] hover:bg-[#21262D] border border-[#30363D] transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar src={user.avatar_url} name={user.name} size="sm" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-[#C9D1D9] truncate">
              {user.name}
            </span>
            {role === "admin" && (
              <Badge variant="approved">Admin</Badge>
            )}
          </div>
          {(user.job_title || user.company) && (
            <p className="text-xs text-[#6E7681] truncate">
              {[user.job_title, user.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {canKick && role !== "admin" && (
        <button
          onClick={() => onKick(user.id)}
          className="flex-shrink-0 text-xs text-[#6E7681] hover:text-[#F85149] transition-colors px-2 py-1 rounded"
        >
          Keluarkan
        </button>
      )}
    </div>
  );
}
