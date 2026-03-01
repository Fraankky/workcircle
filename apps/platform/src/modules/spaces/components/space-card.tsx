import type { Space } from "../types";

const WIFI_LABEL: Record<Space["wifi_speed"], string> = {
  slow: "WiFi Lambat",
  medium: "WiFi OK",
  fast: "WiFi Kencang",
  very_fast: "WiFi Super Cepat",
};

const NOISE_LABEL: Record<Space["noise_level"], string> = {
  quiet: "Tenang",
  medium: "Sedang",
  buzzy: "Agak Ramai",
  loud: "Ramai",
};

const WIFI_COLOR: Record<Space["wifi_speed"], string> = {
  slow: "bg-red-50 text-red-500",
  medium: "bg-yellow-50 text-yellow-600",
  fast: "bg-green-50 text-green-600",
  very_fast: "bg-green-50 text-green-700",
};

const NOISE_COLOR: Record<Space["noise_level"], string> = {
  quiet: "bg-green-50 text-green-600",
  medium: "bg-yellow-50 text-yellow-600",
  buzzy: "bg-orange-50 text-orange-500",
  loud: "bg-red-50 text-red-500",
};

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 p-4 space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{space.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{space.area}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${WIFI_COLOR[space.wifi_speed]}`}>
          {WIFI_LABEL[space.wifi_speed]}
        </span>
        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${NOISE_COLOR[space.noise_level]}`}>
          {NOISE_LABEL[space.noise_level]}
        </span>
        {space.has_power && (
          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-600">
            ⚡ Power
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-50">
        <div className="flex items-center gap-3">
          {space.price_range && (
            <span className="font-medium text-gray-700">{space.price_range}</span>
          )}
          {space.seat_count && (
            <span>{space.seat_count} kursi</span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-0.5">
            <StarIcon />
            <span className="font-medium text-gray-700">{space.rating.toFixed(1)}</span>
          </span>
          {space.active_groups > 0 && (
            <span className="text-indigo-500 font-medium">
              {space.active_groups} grup aktif
            </span>
          )}
        </div>
      </div>

      {/* Address */}
      {space.address && (
        <p className="text-xs text-gray-400 truncate">{space.address}</p>
      )}
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
