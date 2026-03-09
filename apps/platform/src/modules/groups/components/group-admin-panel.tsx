import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/api-client";
import { qk } from "../../../lib/query-keys";
import { GroupEditModal } from "./group-edit-modal";
import type { Group } from "../types";

interface GroupAdminPanelProps {
  group: Group;
  groupId: string;
  onRefetch: () => void;
}

export function GroupAdminPanel({ group, groupId, onRefetch }: GroupAdminPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toggleOpen = useMutation({
    mutationFn: () => api.patch(`/api/groups/${groupId}`, { isOpen: !group.is_open }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.group(groupId) });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onRefetch();
    },
  });

  const deleteGroup = useMutation({
    mutationFn: () => api.delete(`/api/groups/${groupId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: qk.myGroups() });
      navigate({ to: "/discover" });
    },
  });

  return (
    <>
    <div className="bg-surface rounded border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <p className="text-[10px] font-semibold text-faint uppercase tracking-widest">Admin Panel</p>
        <button
          onClick={() => setEditOpen(true)}
          className="text-xs font-medium border border-border text-muted px-2.5 py-1 rounded hover:bg-overlay hover:text-fg transition-colors"
        >
          Edit Info
        </button>
      </div>
      <div className="p-4 space-y-3">
        {/* Toggle open/close */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-fg">
              {group.is_open ? "Grup Terbuka" : "Grup Ditutup"}
            </p>
            <p className="text-xs text-faint mt-0.5">
              {group.is_open
                ? "Anggota baru masih bisa bergabung"
                : "Tidak menerima anggota baru"}
            </p>
          </div>
          <button
            onClick={() => toggleOpen.mutate()}
            disabled={toggleOpen.isPending}
            className={`shrink-0 text-xs font-medium px-3 py-2 rounded border transition-colors disabled:opacity-50 ${
              group.is_open
                ? "border-warning/40 text-warning hover:bg-warning-dim"
                : "border-success/40 text-success hover:bg-success-dim"
            }`}
          >
            {toggleOpen.isPending
              ? "..."
              : group.is_open
                ? "Tutup Grup"
                : "Buka Grup"}
          </button>
        </div>

        {/* Delete group */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border-dim">
          <div>
            <p className="text-sm font-medium text-danger">Hapus Grup</p>
            <p className="text-xs text-faint mt-0.5">Tindakan ini tidak bisa dibatalkan</p>
          </div>
          {confirmDelete ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-muted hover:text-fg px-2 py-1"
              >
                Batal
              </button>
              <button
                onClick={() => deleteGroup.mutate()}
                disabled={deleteGroup.isPending}
                className="text-xs font-medium border border-danger/40 text-danger px-3 py-1.5 rounded hover:bg-danger-dim transition-colors disabled:opacity-50"
              >
                {deleteGroup.isPending ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="shrink-0 text-xs font-medium border border-danger/30 text-danger px-3 py-2 rounded hover:bg-danger-dim transition-colors"
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>

    <GroupEditModal
      group={group}
      groupId={groupId}
      open={editOpen}
      onClose={() => setEditOpen(false)}
    />
    </>
  );
}
