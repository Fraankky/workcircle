import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../modules/auth/hooks";
import { api } from "../../lib/api-client";
import { PageHeader } from "../../components/ui/page-header";
import { qk } from "../../lib/query-keys";

interface AdminGroup {
  id: string;
  name: string;
  category: string;
  is_open: boolean;
  members_count: number;
  admin: { id: string; name: string; email: string };
  space: { id: string; name: string; area: string } | null;
  created_at: string;
}

export function AdminGroupsPage() {
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
    queryKey: qk.adminGroups(page, search),
    queryFn: () =>
      api.list<AdminGroup>(
        `/api/admin/groups?page=${page}&limit=20${search ? `&search=${encodeURIComponent(search)}` : ""}`
      ),
    enabled: !!user?.isAdmin,
  });

  const closeMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/admin/groups/${id}/close`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "groups"] }),
  });

  function handleForceClose(g: AdminGroup) {
    if (!confirm(`Force-close grup "${g.name}"? User tidak bisa join lagi.`)) return;
    closeMutation.mutate(g.id);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  if (authLoading || !user?.isAdmin) return null;

  const groups = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const hasMore = data?.meta.has_more ?? false;

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-6">
      <PageHeader title="Admin — Groups" subtitle={`${total} grup terdaftar`} />

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Cari nama grup..."
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
                {["Nama Grup", "Kategori", "Admin", "Space", "Members", "Status", "Aksi"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-muted font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted text-xs">
                    Tidak ada grup ditemukan
                  </td>
                </tr>
              ) : (
                groups.map((g) => (
                  <tr key={g.id} className="hover:bg-overlay/50 transition-colors">
                    <td className="px-3 py-2.5">
                      <span className="font-medium text-fg text-xs">{g.name}</span>
                    </td>
                    <td className="px-3 py-2.5 text-muted text-xs capitalize">{g.category}</td>
                    <td className="px-3 py-2.5">
                      <div>
                        <p className="text-xs text-fg">{g.admin.name}</p>
                        <p className="text-[10px] text-faint">{g.admin.email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted text-xs">
                      {g.space ? `${g.space.name} (${g.space.area})` : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-muted text-xs">{g.members_count}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        g.is_open
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}>
                        {g.is_open ? "Open" : "Closed"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {g.is_open && (
                        <button
                          onClick={() => handleForceClose(g)}
                          disabled={closeMutation.isPending}
                          className="text-[10px] text-danger/60 hover:text-danger disabled:opacity-40 transition-colors"
                        >
                          Force Close
                        </button>
                      )}
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
          <span>{total} total groups</span>
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
