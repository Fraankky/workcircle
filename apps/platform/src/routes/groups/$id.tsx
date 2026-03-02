import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useGroupDetail } from "../../modules/groups/hooks";
import { GroupInfoTab } from "../../modules/groups/components/group-info-tab";
import { GroupMembersTab } from "../../modules/groups/components/group-members-tab";
import { GroupWaitlistTab } from "../../modules/groups/components/group-waitlist-tab";
import { Avatar } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Modal } from "../../components/ui/modal";
import { GroupDetailSkeleton } from "../../components/ui/skeleton";
import { api, ApiError } from "../../lib/api-client";
import { CATEGORY_LABELS } from "../../lib/constants";
import type { JoinRequest } from "../../modules/groups/types";

type Tab = "info" | "members" | "waitlist";

export function GroupDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { group, myRequest, isLoading, error, isAdmin, isMember, refetch } =
    useGroupDetail(id);
  const [tab, setTab] = useState<Tab>("info");
  const [joinOpen, setJoinOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (isLoading) return <GroupDetailSkeleton />;
  if (error || !group) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-faint">{error ?? "Grup tidak ditemukan"}</p>
        <Link to="/discover" className="mt-3 text-xs text-accent hover:underline">
          Kembali ke Discover
        </Link>
      </div>
    );
  }

  async function handleJoin() {
    setBusy(true);
    try {
      await api.post(`/api/groups/${id}/join-requests`, {
        message: message || undefined,
      });
      setJoinOpen(false);
      setMessage("");
      refetch();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Gagal bergabung");
    } finally {
      setBusy(false);
    }
  }

  async function handleLeave() {
    if (!confirm("Yakin ingin keluar dari grup ini?")) return;
    try {
      await api.post(`/api/groups/${id}/leave`);
      refetch();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Gagal keluar");
    }
  }

  const tabs: Tab[] = isAdmin ? ["info", "members", "waitlist"] : ["info", "members"];
  const tabLabel: Record<Tab, React.ReactNode> = {
    info: "Info",
    members: "Anggota",
    waitlist: (
      <span className="flex items-center gap-1">
        Waitlist
        {(group.pending_count ?? 0) > 0 && (
          <span className="bg-ascent text-bg text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {group.pending_count}
          </span>
        )}
      </span>
    ),
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto p-8">
      <Link
        to="/discover"
        className="inline-flex items-center gap-1 text-xs text-faint hover:text-fg transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Kembali
      </Link>

      {/* Header card */}
      <div className="bg-surface rounded border border-border overflow-hidden">
        <div className="h-0.5 w-full" style={{ backgroundColor: group.color }} />
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-lg font-bold text-fg leading-tight">{group.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="category">
                  {CATEGORY_LABELS[group.category] ?? group.category}
                </Badge>
                <Badge variant={group.is_open ? "open" : "full"}>
                  {group.is_open ? "Open" : "Full"}
                </Badge>
              </div>
            </div>
            <ActionButton
              isAdmin={isAdmin}
              isMember={isMember}
              myRequest={myRequest}
              isOpen={group.is_open}
              onJoin={() => setJoinOpen(true)}
              onLeave={handleLeave}
            />
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-[#21262D]">
            <Avatar src={group.admin.avatar_url} name={group.admin.name} size="xs" />
            <span className="text-xs text-muted truncate">{group.admin.name}</span>
            <span className="ml-auto text-xs text-faint font-medium whitespace-nowrap">
              {group.member_count}/{group.max_members} anggota
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-medium relative transition-colors ${
              tab === t ? "text-ascent" : "text-muted hover:text-fg"
            }`}
          >
            {tabLabel[t]}
            {tab === t && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ascent rounded-t" />
            )}
          </button>
        ))}
      </div>

      {tab === "info" && <GroupInfoTab group={group} />}
      {tab === "members" && (
        <GroupMembersTab group={group} isAdmin={isAdmin} onRefetch={refetch} />
      )}
      {tab === "waitlist" && isAdmin && <GroupWaitlistTab groupId={id} />}

      {/* Join modal */}
      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Bergabung ke Grup">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            {group.require_approval
              ? "Permintaanmu perlu disetujui admin terlebih dahulu."
              : "Kamu akan langsung bergabung ke grup ini."}
          </p>
          {group.require_approval && (
            <div>
              <label className="text-[10px] font-medium text-muted uppercase tracking-widest block mb-1.5">
                Pesan (opsional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ceritakan sedikit tentang kamu..."
                rows={3}
                className="w-full text-sm border border-border bg-surface text-fg rounded px-3 py-2 focus:border-ascent focus:outline-none resize-none placeholder-muted"
              />
            </div>
          )}
          <button
            onClick={handleJoin}
            disabled={busy}
            className="w-full bg-accent text-bg text-sm font-medium py-2.5 rounded hover:bg-accent-glow disabled:opacity-50 transition-colors"
          >
            {busy
              ? "Memproses..."
              : group.require_approval
                ? "Kirim Permintaan"
                : "Bergabung"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function ActionButton({
  isAdmin,
  isMember,
  myRequest,
  isOpen,
  onJoin,
  onLeave,
}: {
  isAdmin: boolean;
  isMember: boolean;
  myRequest: JoinRequest | null;
  isOpen: boolean;
  onJoin: () => void;
  onLeave: () => void;
}) {
  if (isAdmin) return null;

  if (isMember) {
    return (
      <button
        onClick={onLeave}
        className="shrink-0 text-xs font-medium border border-border text-muted px-3 py-2 rounded hover:bg-[#21262D] hover:text-danger transition-colors"
      >
        Keluar
      </button>
    );
  }

  if (myRequest?.status === "pending") {
    return (
      <span className="shrink-0 text-xs font-medium bg-[#21262D] text-faint px-3 py-2 rounded border border-border">
        Menunggu
      </span>
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
