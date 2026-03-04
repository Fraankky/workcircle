import type { Space } from "../types";
import { WIFI_LABELS, NOISE_LABELS } from "../../../lib/constants";

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <div className="bg-surface rounded border border-border hover:border-overlay transition-all duration-150 p-4 space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-fg line-clamp-1">{space.name}</h3>
        <p className="text-xs text-faint mt-0.5">{space.area}</p>
      </div>

      {/* Badges */}
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

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-faint pt-1 border-t border-border-dim">
        <div className="flex items-center gap-3">
          {space.price_range && (
            <span className="font-medium text-fg">{space.price_range}</span>
          )}
          {space.seat_count && (
            <span>{space.seat_count} kursi</span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-0.5">
            <StarIcon />
            <span className="font-medium text-fg">{space.rating.toFixed(1)}</span>
          </span>
          {space.active_groups > 0 && (
            <span className="text-muted font-medium">
              {space.active_groups} grup
            </span>
          )}
        </div>
      </div>

      {/* Address */}
      {space.address && (
        <p className="text-xs text-faint truncate">{space.address}</p>
      )}
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-warning">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
