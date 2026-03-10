import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../modules/auth/hooks";
import { api } from "../../lib/api-client";
import { PageHeader } from "../../components/ui/page-header";
import { qk } from "../../lib/query-keys";
import { cn } from "../../lib/utils";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "team";
  is_admin: boolean;
  email_verified: boolean;
  groups_count: number;
  memberships_count: number;
  created_at: string;
}

const PLAN_COLORS: Record<string, string> = {
  free: "text-muted",
  pro: "text-fg",
  team: "text-fg font-semibold",
};

export function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate({ to: "/discover" });
    }
  }, [user, authLoading, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: qk.adminUsers(page, search),
    queryFn: () =>
      api.list<AdminUser>(
        `/api/admin/users?page=${page}&limit=20${search ? `&search=${encodeURIComponent(search)}` : ""}`
      ),
    enabled: !!user?.isAdmin,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { plan?: string; isAdmin?: boolean } }) =>
      api.patch(`/api/admin/users/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  function handlePlanChange(u: AdminUser, plan: "free" | "pro" | "team") {
    if (plan === u.plan) return;
    if (!confirm(`Ubah plan ${u.name} dari ${u.plan} → ${plan}?`)) return;
    updateMutation.mutate({ id: u.id, payload: { plan } });
  }

  function handleToggleAdmin(u: AdminUser) {
    const action = u.is_admin ? "cabut hak admin" : "jadikan admin";
    if (!confirm(`${action} untuk ${u.name}?`)) return;
    updateMutation.mutate({ id: u.id, payload: { isAdmin: !u.is_admin } });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  if (authLoading || !user?.isAdmin) return null;

  const users = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const hasMore = data?.meta.has_more ?? false;

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-6">
      <PageHeader title="Admin — Users" subtitle={`${total} user terdaftar`} />

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Cari nama atau email..."
          className="flex-1 bg-overlay border border-border rounded px-3 py-1.5 text-sm text-fg placeholder:text-faint outline-none focus:border-fg/30"
        />
        <button type="submit" className="text-xs px-3 py-1.5 rounded border border-border text-muted hover:text-fg transition-colors">
          Cari
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
            className="text-xs px-3 py-1.5 rounded border border-border text-muted hover:text-fg transition-colors"
          >
            Reset
          </button>
        )}
      </form>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 bg-overlay border border-border rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                {["Nama", "Email", "Plan", "Verified", "Grup", "Admin", "Aksi"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-muted font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted text-xs">
                    Tidak ada user ditemukan
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-overlay/50 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-fg text-xs">{u.name}</span>
                        {u.is_admin && (
                          <span className="text-[9px] bg-fg/10 text-fg px-1 py-0.5 rounded font-semibold">ADMIN</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted text-xs">{u.email}</td>
                    <td className="px-3 py-2.5">
                      <select
                        value={u.plan}
                        onChange={(e) => handlePlanChange(u, e.target.value as "free" | "pro" | "team")}
                        disabled={updateMutation.isPending}
                        className={cn(
                          "bg-transparent border border-transparent rounded text-xs outline-none cursor-pointer hover:border-border disabled:opacity-50",
                          PLAN_COLORS[u.plan]
                        )}
                      >
                        {["free", "pro", "team"].map((p) => (
                          <option key={p} value={p} className="bg-bg text-fg">
                            {p.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2.5 text-xs">
                      {u.email_verified ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-muted text-xs">
                      {u.groups_count}a / {u.memberships_count}m
                    </td>
                    <td className="px-3 py-2.5 text-xs">
                      <span className={u.is_admin ? "text-fg" : "text-faint"}>
                        {u.is_admin ? "Ya" : "Tidak"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => handleToggleAdmin(u)}
                        disabled={updateMutation.isPending || u.id === user?.id}
                        className="text-[10px] text-muted hover:text-fg disabled:opacity-30 transition-colors"
                        title={u.id === user?.id ? "Tidak bisa mengubah akun sendiri" : ""}
                      >
                        {u.is_admin ? "Cabut Admin" : "Jadikan Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{total} total users</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border border-border rounded disabled:opacity-30 hover:text-fg transition-colors"
            >
              Prev
            </button>
            <span className="px-3 py-1">Halaman {page}</span>
            <button
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border border-border rounded disabled:opacity-30 hover:text-fg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
