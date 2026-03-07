import { useParams, Link } from "@tanstack/react-router";
import { useSpaceDetail } from "../../modules/spaces/hooks/use-space-detail";
import { BackLink } from "../../components/ui/back-link";
import { Badge } from "../../components/ui/badge";
import { WIFI_LABELS, NOISE_LABELS, CATEGORY_LABELS } from "../../lib/constants";

export function SpaceDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { space, isLoading, error } = useSpaceDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-5 p-6">
        <div className="h-4 w-20 bg-overlay animate-pulse rounded" />
        <div className="bg-surface rounded border border-border p-6 space-y-4">
          <div className="h-6 w-48 bg-overlay animate-pulse rounded" />
          <div className="h-4 w-32 bg-overlay animate-pulse rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-5 w-16 bg-overlay animate-pulse rounded" />
            ))}
          </div>
        </div>
        <div className="bg-surface rounded border border-border p-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-overlay animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center p-6">
        <p className="text-sm text-faint">{error ?? "Space tidak ditemukan"}</p>
        <Link to="/spaces" className="mt-3 text-xs text-fg hover:underline">
          Kembali ke Spaces
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6 max-w-2xl mx-auto">
      <BackLink to="/spaces" label="Kembali ke Spaces" />

      {/* Space info card */}
      <div className="bg-surface rounded border border-border overflow-hidden">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-fg leading-tight">{space.name}</h1>
              <p className="text-xs text-faint mt-0.5">{space.area}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <StarIcon />
              <span className="text-sm font-semibold text-fg">{space.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted">
            {space.seat_count && <span>{space.seat_count} kursi</span>}
            {space.price_range && <span className="font-medium text-fg">{space.price_range}</span>}
            {space.active_groups_count > 0 && (
              <span>{space.active_groups_count} grup aktif</span>
            )}
          </div>

          {/* Fasilitas */}
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-overlay text-muted border border-border">
              {WIFI_LABELS[space.wifi_speed]}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-overlay text-muted border border-border">
              {NOISE_LABELS[space.noise_level]}
            </span>
            {space.has_power && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-overlay text-muted border border-border">
                ⚡ Power
              </span>
            )}
          </div>

          {/* Alamat */}
          {space.address && (
            <div className="flex items-start gap-2 pt-3 border-t border-border-dim">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-faint shrink-0 mt-0.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-xs text-muted">{space.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Grup aktif */}
      {space.active_groups.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">
            Grup Aktif di Sini
          </h2>
          <div className="space-y-2">
            {space.active_groups.map((group) => (
              <Link
                key={group.id}
                to="/groups/$id"
                params={{ id: group.id }}
                className="flex items-center justify-between gap-3 bg-surface border border-border rounded p-3 hover:border-overlay transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-1 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-fg truncate">{group.name}</p>
                    <p className="text-xs text-faint mt-0.5">{group.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="category">
                    {CATEGORY_LABELS[group.category] ?? group.category}
                  </Badge>
                  <Badge variant={group.is_open ? "open" : "full"}>
                    {group.is_open ? "Open" : "Full"}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {space.active_groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded">
          <p className="text-sm text-faint">Belum ada grup aktif di space ini</p>
          <Link to="/discover" className="mt-2 text-xs text-fg font-medium hover:underline">
            Temukan grup
          </Link>
        </div>
      )}
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-warning">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
