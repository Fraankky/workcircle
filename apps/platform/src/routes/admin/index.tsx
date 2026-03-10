import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../modules/auth/hooks";
import { api } from "../../lib/api-client";
import { PageHeader } from "../../components/ui/page-header";
import { qk } from "../../lib/query-keys";

interface AdminStats {
  totalUsers: number;
  totalGroups: number;
  totalSpaces: number;
  proUsers: number;
  teamUsers: number;
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-overlay border border-border rounded p-5">
      <p className="text-[11px] text-muted uppercase tracking-wider font-medium">{label}</p>
      <p className="text-3xl font-bold text-fg mt-1">{value.toLocaleString()}</p>
      {sub && <p className="text-[10px] text-faint mt-0.5">{sub}</p>}
    </div>
  );
}

export function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate({ to: "/discover" });
    }
  }, [user, authLoading, navigate]);

  const { data: stats, isLoading } = useQuery({
    queryKey: qk.adminStats(),
    queryFn: () => api.get<AdminStats>("/api/admin/stats"),
    enabled: !!user?.isAdmin,
  });

  if (authLoading || !user?.isAdmin) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview statistik platform WorkCircle"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-overlay border border-border rounded p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Groups" value={stats.totalGroups} />
          <StatCard label="Total Spaces" value={stats.totalSpaces} />
          <StatCard
            label="Pro Users"
            value={stats.proUsers}
            sub={`${((stats.proUsers / stats.totalUsers) * 100).toFixed(1)}% of users`}
          />
          <StatCard
            label="Team Users"
            value={stats.teamUsers}
            sub={`${((stats.teamUsers / stats.totalUsers) * 100).toFixed(1)}% of users`}
          />
          <StatCard
            label="Free Users"
            value={stats.totalUsers - stats.proUsers - stats.teamUsers}
            sub="Potential to upgrade"
          />
        </div>
      ) : null}

      {/* Quick nav */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {[
          { to: "/admin/spaces", label: "Kelola Spaces", desc: "Tambah, edit, hapus coworking space" },
          { to: "/admin/users", label: "Kelola Users", desc: "Lihat user, ubah plan, toggle admin" },
          { to: "/admin/groups", label: "Kelola Groups", desc: "Lihat semua grup, force-close jika perlu" },
        ].map((item) => (
          <button
            key={item.to}
            onClick={() => navigate({ to: item.to as never })}
            className="bg-overlay border border-border rounded p-4 text-left hover:bg-surface transition-colors group"
          >
            <p className="text-sm font-semibold text-fg group-hover:text-fg">{item.label}</p>
            <p className="text-[11px] text-muted mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
