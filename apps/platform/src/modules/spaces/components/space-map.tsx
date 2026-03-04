import type { LatLngExpression } from "leaflet";
import {
  Map,
  MapAttribution,
  MapMarker,
  MapMarkerClusterGroup,
  MapPopup,
  MapTileLayer,
  MapTooltip,
  MapZoomControl,
} from "../../../components/ui/map";
import { cn } from "../../../lib/utils";
import { WIFI_LABELS } from "../../../lib/constants";
import type { Space } from "../types";

// Jakarta sebagai default center
const JAKARTA_CENTER: LatLngExpression = [-6.2088, 106.8456];

interface SpaceMapProps {
  spaces: Space[];
  selectedSpaceId?: string;
  onSpaceSelect?: (id: string) => void;
  className?: string;
}

// Inline styles required — this HTML is injected into Leaflet's divIcon
// (outside React tree, so Tailwind classes won't apply)
function SpaceMarkerIcon({ isSelected }: { isSelected?: boolean }) {
  const size = isSelected ? 32 : 24;
  const dotSize = isSelected ? 10 : 8;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#FFFFFF",
        border: "2.5px solid #07070A",
        boxShadow: isSelected
          ? "0 0 0 3px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.5)"
          : "0 2px 4px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: "#07070A",
        }}
      />
    </div>
  );
}

function SpacePopupContent({ space }: { space: Space }) {
  return (
    <div style={{ width: 220, overflow: "hidden", borderRadius: 6, background: "rgba(255,255,255,0.06)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "8px 12px" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{space.name}</p>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.50)", marginTop: 2 }}>{space.area}</p>
      </div>

      {/* Body */}
      <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
        {/* Rating + seats */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "rgba(255,255,255,0.50)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,210,100,0.80)", fontWeight: 600 }}>
            ★ {space.rating.toFixed(1)}
          </span>
          {space.seat_count && (
            <span>{space.seat_count} kursi</span>
          )}
          {space.active_groups > 0 && (
            <span style={{ color: "rgba(255,255,255,0.70)" }}>{space.active_groups} grup</span>
          )}
        </div>

        {/* WiFi */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {WIFI_LABELS[space.wifi_speed]}
          </span>
          {space.has_power && (
            <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.08)" }}>
              ⚡ Power
            </span>
          )}
        </div>

        {/* Price */}
        {space.price_range && (
          <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{space.price_range}</p>
        )}
      </div>
    </div>
  );
}

export function SpaceMap({
  spaces,
  selectedSpaceId,
  onSpaceSelect,
  className,
}: SpaceMapProps) {
  const spacesWithCoords = spaces.filter(
    (s) => s.latitude != null && s.longitude != null
  );

  // Kalau ada spaces, center ke rata-rata koordinat; fallback Jakarta
  const center: LatLngExpression =
    spacesWithCoords.length > 0
      ? ([
          spacesWithCoords.reduce((sum, s) => sum + s.latitude!, 0) /
            spacesWithCoords.length,
          spacesWithCoords.reduce((sum, s) => sum + s.longitude!, 0) /
            spacesWithCoords.length,
        ] as LatLngExpression)
      : JAKARTA_CENTER;

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Map center={center} zoom={12}>
        <MapTileLayer variant="dark" />
        <MapZoomControl />
        <MapAttribution />

        <MapMarkerClusterGroup>
          {spacesWithCoords.map((space) => {
            const position: LatLngExpression = [space.latitude!, space.longitude!];
            const isSelected = space.id === selectedSpaceId;

            return (
              <MapMarker
                key={space.id}
                position={position}
                icon={<SpaceMarkerIcon isSelected={isSelected} />}
                iconAnchor={isSelected ? [16, 16] : [12, 12]}
                eventHandlers={{
                  click: () => onSpaceSelect?.(space.id),
                }}
              >
                <MapTooltip>{space.name}</MapTooltip>
                <MapPopup>
                  <SpacePopupContent space={space} />
                </MapPopup>
              </MapMarker>
            );
          })}
        </MapMarkerClusterGroup>
      </Map>

      {/* Fallback: kalau tidak ada space dengan koordinat */}
      {spacesWithCoords.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded bg-surface">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-border"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-xs font-medium text-faint">
            Tidak ada lokasi tersedia
          </p>
        </div>
      )}
    </div>
  );
}
