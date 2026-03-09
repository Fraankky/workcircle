import { useState, useRef } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { uploadImage } from "../../lib/upload";
import { api } from "../../lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "../../lib/query-keys";
import { BackLink } from "../../components/ui/back-link";
import { useGroupDetail } from "../../modules/groups/hooks";
import { useGroupActions } from "../../modules/groups/hooks/use-group-actions";
import { GroupInfoTab } from "../../modules/groups/components/group-info-tab";
import { GroupMembersTab } from "../../modules/groups/components/group-members-tab";
import { GroupWaitlistTab } from "../../modules/groups/components/group-waitlist-tab";
import { Avatar } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Modal } from "../../components/ui/modal";
import { GroupDetailSkeleton } from "../../components/ui/skeleton";
import { ActionButton } from "../../modules/groups/components/action-button";
import { GroupAdminPanel } from "../../modules/groups/components/group-admin-panel";
import { CATEGORY_LABELS } from "../../lib/constants";

type Tab = "info" | "members" | "waitlist";

export function GroupDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { group, myRequest, isLoading, error, isAdmin, isMember, refetch } =
    useGroupDetail(id);
  const { join, leave, isJoining: busy } = useGroupActions(id, refetch);
  const [tab, setTab] = useState<Tab>("info");
  const [joinOpen, setJoinOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const publicUrl = await uploadImage(file, "group-cover");
      await api.patch(`/api/groups/${id}`, { coverUrl: publicUrl });
      queryClient.invalidateQueries({ queryKey: qk.group(id) });
    } catch {
      alert("Upload cover gagal");
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  if (isLoading) return <GroupDetailSkeleton />;
  if (error || !group) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-faint">{error ?? "Grup tidak ditemukan"}</p>
        <Link to="/discover" className="mt-3 text-xs text-fg hover:underline">
          Kembali ke Discover
        </Link>
      </div>
    );
  }

  async function handleJoin() {
    try {
      await join(message || undefined);
      setJoinOpen(false);
      setMessage("");
    } catch {
      alert("Gagal bergabung");
    }
  }

  async function handleLeave() {
    if (!confirm("Yakin ingin keluar dari grup ini?")) return;
    try {
      await leave();
    } catch {
      alert("Gagal keluar");
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
    <div className="space-y-5 p-6">
      <BackLink to="/discover" />

      {/* Header card */}
      <div className="bg-surface rounded border border-border overflow-hidden">
        {group.cover_url ? (
          <div className="relative">
            <img src={group.cover_url} alt={group.name} className="w-full h-32 object-cover" />
            {isAdmin && (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
                className="absolute top-2 right-2 bg-black/60 text-fg text-[10px] px-2 py-1 rounded hover:bg-black/80 disabled:opacity-50"
              >
                {coverUploading ? "Upload..." : "Ganti Cover"}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="h-0.5 w-full" style={{ backgroundColor: group.color }} />
            {isAdmin && (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
                className="w-full text-[10px] text-faint py-1.5 hover:text-muted hover:bg-overlay transition-colors disabled:opacity-50"
              >
                {coverUploading ? "Mengupload..." : "+ Tambah Cover Foto"}
              </button>
            )}
          </>
        )}
        {isAdmin && (
          <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverFile} />
        )}
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
          <div className="flex items-center gap-2 pt-2 border-t border-border-dim">
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

      {/* Admin panel */}
      {isAdmin && <GroupAdminPanel group={group} groupId={id} onRefetch={refetch} />}

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

