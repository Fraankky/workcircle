import { useState } from "react";
import { useGroupActions } from "../hooks/use-group-actions";
import { ConfirmModal } from "../../../components/ui/confirm-modal";
import { MemberCard } from "./member-card";
import { useToast } from "../../../components/ui/toast";
import { ApiError } from "../../../lib/api-client";
import type { Group } from "../types";

interface GroupMembersTabProps {
  group: Group;
  isAdmin: boolean;
  onRefetch: () => void;
}

export function GroupMembersTab({ group, isAdmin, onRefetch }: GroupMembersTabProps) {
  const members = group.members ?? [];
  const { kick } = useGroupActions(group.id, onRefetch);
  const { toast } = useToast();
  const [kickUserId, setKickUserId] = useState<string | null>(null);

  async function handleKickConfirm() {
    if (!kickUserId) return;
    try {
      await kick(kickUserId);
      toast("Anggota berhasil dikeluarkan", "success");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Gagal mengeluarkan anggota", "error");
    } finally {
      setKickUserId(null);
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
          onKick={(userId) => setKickUserId(userId)}
        />
      ))}

      <ConfirmModal
        open={kickUserId !== null}
        onClose={() => setKickUserId(null)}
        onConfirm={handleKickConfirm}
        message="Yakin ingin mengeluarkan anggota ini dari grup?"
        confirmLabel="Keluarkan"
      />
    </div>
  );
}
