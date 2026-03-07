import { Link } from "@tanstack/react-router";
import { useAuth } from "../../modules/auth/hooks";
import { useMyGroups } from "../../modules/groups/hooks/use-my-groups";
import { useProfileEdit } from "../../modules/profile/hooks/use-profile-edit";
import { ProfileStats } from "../../modules/profile/components/profile-stats";
import { ProfileInfoRow } from "../../modules/profile/components/profile-info-row";
import { ProfileEditForm } from "../../modules/profile/components/profile-edit-form";
import { Avatar } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  team: "Team",
};

export function ProfilePage() {
  const { user } = useAuth();
  const { admin_groups, member_groups } = useMyGroups();
  const { editing, busy, error, form, setForm, startEdit, cancelEdit, save, handleLogout } =
    useProfileEdit();

  if (!user) return null;

  return (
    <div className="space-y-5 p-8 max-w-3xl mx-auto">
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
                  <Link to="/upgrade" className="text-[10px] text-accent hover:underline font-medium">
                    Upgrade ke Pro
                  </Link>
                )}
              </div>
            </div>
            <button
              onClick={startEdit}
              className="shrink-0 text-xs font-medium border border-border text-muted px-3 py-2 rounded hover:bg-overlay hover:text-fg transition-colors"
            >
              Edit
            </button>
          </div>

          <ProfileStats adminCount={admin_groups.length} memberCount={member_groups.length} />

          {!editing && <ProfileInfoRow user={user} onEdit={startEdit} />}
        </div>
      </div>

      {editing && (
        <ProfileEditForm
          form={form}
          onChange={setForm}
          error={error}
          busy={busy}
          onSave={save}
          onCancel={cancelEdit}
        />
      )}

      {/* Logout */}
      <div className="bg-surface rounded border border-border p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-fg">Keluar</p>
          <p className="text-xs text-faint mt-0.5">Keluar dari akun WorkCircle</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-medium border border-danger/30 text-danger px-3 py-2 rounded hover:bg-danger-dim transition-colors"
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
