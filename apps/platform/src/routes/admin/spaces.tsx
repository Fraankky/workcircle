import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../modules/auth/hooks";
import { api } from "../../lib/api-client";
import { PageHeader } from "../../components/ui/page-header";
import { qk } from "../../lib/query-keys";

interface AdminSpace {
  id: string;
  name: string;
  area: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  wifi_speed: string;
  noise_level: string;
  has_power: boolean;
  price_range: string | null;
  rating: number;
  seat_count: number | null;
  active_groups: number;
  created_at: string;
}

interface SpaceFormData {
  name: string;
  area: string;
  address: string;
  latitude: string;
  longitude: string;
  wifi_speed: string;
  noise_level: string;
  has_power: boolean;
  price_range: string;
  rating: string;
  seat_count: string;
}

const WIFI_OPTIONS = ["slow", "medium", "fast", "very_fast"];
const NOISE_OPTIONS = ["quiet", "medium", "buzzy", "loud"];

const EMPTY_FORM: SpaceFormData = {
  name: "",
  area: "",
  address: "",
  latitude: "",
  longitude: "",
  wifi_speed: "medium",
  noise_level: "medium",
  has_power: true,
  price_range: "",
  rating: "0",
  seat_count: "",
};

function spaceToForm(s: AdminSpace): SpaceFormData {
  return {
    name: s.name,
    area: s.area,
    address: s.address ?? "",
    latitude: s.latitude != null ? String(s.latitude) : "",
    longitude: s.longitude != null ? String(s.longitude) : "",
    wifi_speed: s.wifi_speed,
    noise_level: s.noise_level,
    has_power: s.has_power,
    price_range: s.price_range ?? "",
    rating: String(s.rating),
    seat_count: s.seat_count != null ? String(s.seat_count) : "",
  };
}

function formToPayload(f: SpaceFormData) {
  return {
    name: f.name,
    area: f.area,
    address: f.address || undefined,
    latitude: f.latitude ? parseFloat(f.latitude) : undefined,
    longitude: f.longitude ? parseFloat(f.longitude) : undefined,
    wifiSpeed: f.wifi_speed as "slow" | "medium" | "fast" | "very_fast",
    noiseLevel: f.noise_level as "quiet" | "medium" | "buzzy" | "loud",
    hasPower: f.has_power,
    priceRange: f.price_range || undefined,
    rating: parseFloat(f.rating) || 0,
    seatCount: f.seat_count ? parseInt(f.seat_count) : undefined,
  };
}

export function AdminSpacesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [editingSpace, setEditingSpace] = useState<AdminSpace | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SpaceFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate({ to: "/discover" });
    }
  }, [user, authLoading, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: qk.adminSpaces(page, search),
    queryFn: () =>
      api.list<AdminSpace>(
        `/api/admin/spaces?page=${page}&limit=20${search ? `&search=${encodeURIComponent(search)}` : ""}`
      ),
    enabled: !!user?.isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: (payload: ReturnType<typeof formToPayload>) =>
      api.post("/api/admin/spaces", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "spaces"] });
      closeForm();
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReturnType<typeof formToPayload> }) =>
      api.patch(`/api/admin/spaces/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "spaces"] });
      closeForm();
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/spaces/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "spaces"] }),
  });

  function openCreate() {
    setEditingSpace(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  }

  function openEdit(s: AdminSpace) {
    setEditingSpace(s);
    setForm(spaceToForm(s));
    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingSpace(null);
    setFormError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = formToPayload(form);
    if (editingSpace) {
      updateMutation.mutate({ id: editingSpace.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleDelete(s: AdminSpace) {
    if (!confirm(`Hapus space "${s.name}"? Semua grup di space ini akan kehilangan referensi.`)) return;
    deleteMutation.mutate(s.id);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  if (authLoading || !user?.isAdmin) return null;

  const spaces = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const hasMore = data?.meta.has_more ?? false;
  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-5xl mx-auto space-y-5 py-6">
      <div className="flex items-center justify-between gap-4">
        <PageHeader title="Admin — Spaces" subtitle={`${total} coworking spaces terdaftar`} />
        <button
          onClick={openCreate}
          className="shrink-0 text-xs px-3 py-1.5 rounded bg-fg text-bg font-semibold hover:opacity-90 transition-opacity"
        >
          + Tambah Space
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Cari nama atau area..."
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

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-overlay border border-border rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                {["Nama", "Area", "WiFi", "Noise", "Power", "Rating", "Kursi", "Grup Aktif", ""].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-muted font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {spaces.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-muted text-xs">
                    Tidak ada space ditemukan
                  </td>
                </tr>
              ) : (
                spaces.map((s) => (
                  <tr key={s.id} className="hover:bg-overlay/50 transition-colors">
                    <td className="px-3 py-2.5 font-medium text-fg text-xs">{s.name}</td>
                    <td className="px-3 py-2.5 text-muted text-xs">{s.area}</td>
                    <td className="px-3 py-2.5 text-muted text-xs">{s.wifi_speed}</td>
                    <td className="px-3 py-2.5 text-muted text-xs">{s.noise_level}</td>
                    <td className="px-3 py-2.5 text-xs">{s.has_power ? "✓" : "—"}</td>
                    <td className="px-3 py-2.5 text-muted text-xs">{s.rating.toFixed(1)}</td>
                    <td className="px-3 py-2.5 text-muted text-xs">{s.seat_count ?? "—"}</td>
                    <td className="px-3 py-2.5 text-muted text-xs">{s.active_groups}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="text-[10px] text-muted hover:text-fg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          disabled={deleteMutation.isPending}
                          className="text-[10px] text-danger/50 hover:text-danger transition-colors disabled:opacity-40"
                        >
                          Hapus
                        </button>
                      </div>
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
          <span>{total} total spaces</span>
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

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <div className="w-full max-w-lg bg-overlay border border-border rounded p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-fg">
                {editingSpace ? "Edit Space" : "Tambah Space Baru"}
              </h2>
              <button onClick={closeForm} className="text-faint hover:text-fg text-lg leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: "Nama *", key: "name", placeholder: "Contoh: Kedai Kopi Co" },
                { label: "Area *", key: "area", placeholder: "Contoh: Sudirman" },
                { label: "Alamat", key: "address", placeholder: "Jl. Sudirman No. 1" },
                { label: "Latitude", key: "latitude", placeholder: "-6.200000" },
                { label: "Longitude", key: "longitude", placeholder: "106.816666" },
                { label: "Rentang Harga", key: "price_range", placeholder: "Rp 20.000 – Rp 50.000" },
                { label: "Rating (0–5)", key: "rating", placeholder: "4.2" },
                { label: "Jumlah Kursi", key: "seat_count", placeholder: "40" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] text-muted uppercase tracking-wider font-medium mb-1">
                    {label}
                  </label>
                  <input
                    value={form[key as keyof SpaceFormData] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-surface border border-border rounded px-3 py-1.5 text-sm text-fg placeholder:text-faint outline-none focus:border-fg/30"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-muted uppercase tracking-wider font-medium mb-1">WiFi Speed</label>
                  <select
                    value={form.wifi_speed}
                    onChange={(e) => setForm((f) => ({ ...f, wifi_speed: e.target.value }))}
                    className="w-full bg-surface border border-border rounded px-3 py-1.5 text-sm text-fg outline-none focus:border-fg/30"
                  >
                    {WIFI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-muted uppercase tracking-wider font-medium mb-1">Noise Level</label>
                  <select
                    value={form.noise_level}
                    onChange={(e) => setForm((f) => ({ ...f, noise_level: e.target.value }))}
                    className="w-full bg-surface border border-border rounded px-3 py-1.5 text-sm text-fg outline-none focus:border-fg/30"
                  >
                    {NOISE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.has_power}
                  onChange={(e) => setForm((f) => ({ ...f, has_power: e.target.checked }))}
                  className="rounded border-border"
                />
                <span className="text-xs text-fg">Ada colokan listrik (has power)</span>
              </label>

              {formError && (
                <p className="text-xs text-danger bg-danger-dim border border-danger/20 rounded px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isMutating}
                  className="flex-1 py-2 rounded bg-fg text-bg text-xs font-semibold disabled:opacity-50"
                >
                  {isMutating ? "Menyimpan..." : editingSpace ? "Simpan Perubahan" : "Tambah Space"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded border border-border text-xs text-muted hover:text-fg transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
