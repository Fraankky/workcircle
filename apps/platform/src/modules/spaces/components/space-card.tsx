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
  slow: "bg-[#3D1A1A] text-[#F85149] border border-[#F85149]/20",
  medium: "bg-[#3A2D10] text-[#D29922] border border-[#D29922]/20",
  fast: "bg-[#1A3A21] text-[#3FB950] border border-[#3FB950]/20",
  very_fast: "bg-[#1A3A21] text-[#3FB950] border border-[#3FB950]/20",
};

const NOISE_COLOR: Record<Space["noise_level"], string> = {
  quiet: "bg-[#1A3A21] text-[#3FB950] border border-[#3FB950]/20",
  medium: "bg-[#3A2D10] text-[#D29922] border border-[#D29922]/20",
  buzzy: "bg-[#3A2410] text-[#F0883E] border border-[#F0883E]/20",
  loud: "bg-[#3D1A1A] text-[#F85149] border border-[#F85149]/20",
};

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <div className="bg-[#161B22] rounded border border-[#30363D] hover:border-[#484F58] transition-all duration-150 p-4 space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-[#C9D1D9] line-clamp-1">{space.name}</h3>
        <p className="text-xs text-[#6E7681] mt-0.5">{space.area}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${WIFI_COLOR[space.wifi_speed]}`}>
          {WIFI_LABEL[space.wifi_speed]}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${NOISE_COLOR[space.noise_level]}`}>
          {NOISE_LABEL[space.noise_level]}
        </span>
        {space.has_power && (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#1F3558] text-[#58A6FF] border border-[#58A6FF]/20">
            ⚡ Power
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-[#6E7681] pt-1 border-t border-[#21262D]">
        <div className="flex items-center gap-3">
          {space.price_range && (
            <span className="font-medium text-[#C9D1D9]">{space.price_range}</span>
          )}
          {space.seat_count && (
            <span>{space.seat_count} kursi</span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-0.5">
            <StarIcon />
            <span className="font-medium text-[#C9D1D9]">{space.rating.toFixed(1)}</span>
          </span>
          {space.active_groups > 0 && (
            <span className="text-[#58A6FF] font-medium">
              {space.active_groups} grup
            </span>
          )}
        </div>
      </div>

      {/* Address */}
      {space.address && (
        <p className="text-xs text-[#6E7681] truncate">{space.address}</p>
      )}
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-[#D29922]">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
