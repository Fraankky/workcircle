import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../modules/auth/hooks";
import { useMyGroups } from "../../modules/groups/hooks/use-my-groups";
import { Avatar } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { ApiError } from "../../lib/api-client";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  team: "Team",
};

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { admin_groups, member_groups } = useMyGroups();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    jobTitle: user?.jobTitle ?? "",
    company: user?.company ?? "",
    location: user?.location ?? "",
  });

  if (!user) return null;

  function startEdit() {
    setForm({
      name: user!.name,
      bio: user!.bio ?? "",
      jobTitle: user!.jobTitle ?? "",
      company: user!.company ?? "",
      location: user!.location ?? "",
    });
    setError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError(null);
  }

  async function handleSave() {
    setBusy(true);
    setError(null);
    try {
      await updateProfile({
        name: form.name || undefined,
        bio: form.bio || undefined,
        jobTitle: form.jobTitle || undefined,
        company: form.company || undefined,
        location: form.location || undefined,
      });
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan profil");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate({ to: "/login" });
  }

  const totalGroups = admin_groups.length + member_groups.length;

  return (
    <div className="max-w-2xl mx-auto space-y-5 p-8">
      {/* Profile card */}
      <div className="bg-surface rounded border border-border overflow-hidden">
        <div className="h-0.5 w-full bg-accent" />
        <div className="p-6 space-y-5">
          {/* Avatar + name row */}
          <div className="flex items-start gap-4">
            <Avatar src={user.avatarUrl} name={user.name} size="lg" />
            <div className="flex-1 min-w-0 space-y-1">
              <h1 className="text-lg font-bold text-fg leading-tight">{user.name}</h1>
              <p className="text-xs text-muted">{user.email}</p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant={user.plan === "free" ? "category" : "approved"}>
                  {PLAN_LABEL[user.plan] ?? user.plan}
                </Badge>
                {user.plan === "free" && (
                  <Link
                    to="/upgrade"
                    className="text-[10px] text-accent hover:underline font-medium"
                  >
                    Upgrade ke Pro
                  </Link>
                )}
              </div>
            </div>
            <button
              onClick={startEdit}
              className="shrink-0 text-xs font-medium border border-border text-muted px-3 py-2 rounded hover:bg-[#21262D] hover:text-fg transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
            <StatBox label="Admin" value={admin_groups.length} />
            <StatBox label="Anggota" value={member_groups.length} />
            <StatBox label="Total Grup" value={totalGroups} />
          </div>

          {/* Info rows */}
          {!editing && (
            <div className="space-y-2 border-t border-border pt-4">
              {user.bio && (
                <p className="text-sm text-muted leading-relaxed">{user.bio}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {user.jobTitle && (
                  <InfoRow icon="briefcase" label="Jabatan" value={user.jobTitle} />
                )}
                {user.company && (
                  <InfoRow icon="building" label="Perusahaan" value={user.company} />
                )}
                {user.location && (
                  <InfoRow icon="pin" label="Lokasi" value={user.location} />
                )}
              </div>
              {!user.bio && !user.jobTitle && !user.company && !user.location && (
                <p className="text-xs text-faint">
                  Belum ada info profil.{" "}
                  <button onClick={startEdit} className="text-accent hover:underline">
                    Lengkapi sekarang
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-surface rounded border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-fg">Edit Profil</h2>

          {error && (
            <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="space-y-3">
            <Field
              label="Nama"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="Nama lengkap"
            />
            <Field
              label="Bio"
              value={form.bio}
              onChange={(v) => setForm((f) => ({ ...f, bio: v }))}
              placeholder="Ceritakan sedikit tentang kamu"
              multiline
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Jabatan"
                value={form.jobTitle}
                onChange={(v) => setForm((f) => ({ ...f, jobTitle: v }))}
                placeholder="Software Engineer"
              />
              <Field
                label="Perusahaan"
                value={form.company}
                onChange={(v) => setForm((f) => ({ ...f, company: v }))}
                placeholder="PT. Contoh Indonesia"
              />
            </div>
            <Field
              label="Lokasi"
              value={form.location}
              onChange={(v) => setForm((f) => ({ ...f, location: v }))}
              placeholder="Jakarta, Indonesia"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={busy || !form.name.trim()}
              className="flex-1 bg-accent text-bg text-sm font-medium py-2.5 rounded hover:bg-accent-glow disabled:opacity-50 transition-colors"
            >
              {busy ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              onClick={cancelEdit}
              disabled={busy}
              className="px-4 text-sm text-muted border border-border rounded hover:bg-[#21262D] hover:text-fg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="bg-surface rounded border border-border p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-fg">Keluar</p>
          <p className="text-xs text-faint mt-0.5">Keluar dari akun WorkCircle</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-medium border border-danger/30 text-danger px-3 py-2 rounded hover:bg-[#3D1A1A] transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Member since */}
      <p className="text-center text-[10px] text-faint">
        Bergabung sejak{" "}
        {new Date(user.createdAt).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
        })}
      </p>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#1C2128] rounded border border-border p-3 text-center">
      <p className="text-lg font-bold text-fg">{value}</p>
      <p className="text-[10px] text-faint uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: "briefcase" | "building" | "pin";
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <InfoIcon type={icon} />
      <span className="text-faint">{label}:</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function InfoIcon({ type }: { type: "briefcase" | "building" | "pin" }) {
  if (type === "briefcase") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-faint">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    );
  }
  if (type === "building") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-faint">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M9 22V12h6v10M9 7h1M14 7h1M9 12h1M14 12h1" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-faint">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const cls =
    "w-full text-sm border border-border bg-[#1C2128] text-fg rounded px-3 py-2 focus:border-accent focus:outline-none transition-colors placeholder-[#6E7681]";

  return (
    <div>
      <label className="text-[10px] font-medium text-muted uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}
