import { useGroupActions } from "../hooks/use-group-actions";
import { MemberCard } from "./member-card";
import type { Group } from "../types";

interface GroupMembersTabProps {
  group: Group;
  isAdmin: boolean;
  onRefetch: () => void;
}

export function GroupMembersTab({ group, isAdmin, onRefetch }: GroupMembersTabProps) {
  const members = group.members ?? [];
  const { kick } = useGroupActions(group.id, onRefetch);

  async function handleKick(userId: string) {
    if (!confirm("Yakin ingin mengeluarkan anggota ini?")) return;
    try {
      await kick(userId);
    } catch {
      alert("Gagal mengeluarkan anggota");
    }
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-2xl mb-2 opacity-30">—</p>
        <p className="text-sm text-faint">Belum ada anggota</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-faint">
        {group.member_count}/{group.max_members} anggota
      </p>
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          canKick={isAdmin}
          onKick={handleKick}
        />
      ))}
    </div>
  );
}
