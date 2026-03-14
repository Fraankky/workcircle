import { useState, useCallback, useMemo } from "react";
import {
  Map,
  MapTileLayer,
  MapMarker,
  MapMarkerClusterGroup,
  MapPopup,
  MapZoomControl,
  MapAttribution,
} from "../../../components/ui/map";
import { WIFI_LABELS } from "../../../lib/constants";
import type { Space } from "../types";
import type { LatLngExpression } from "leaflet";

const JAKARTA_CENTER: LatLngExpression = [-6.2088, 106.8456];

interface SpaceMapProps {
  spaces: Space[];
  selectedSpaceId?: string;
  onSpaceSelect?: (id: string) => void;
  className?: string;
}

function SpacePopupContent({ space }: { space: Space }) {
  return (
    <div className="p-3 font-mono text-xs">
      <div className="mb-2 border-b border-border pb-2">
        <p className="font-semibold text-fg leading-tight">{space.name}</p>
        <p className="mt-0.5 text-muted">{space.area}</p>
      </div>

      <div className="mb-2 flex items-center gap-2.5 text-muted">
        <span className="font-semibold text-[rgba(255,210,100,0.90)]">
          ★ {space.rating.toFixed(1)}
        </span>
        {space.seat_count && <span>{space.seat_count} kursi</span>}
        {space.active_groups > 0 && (
          <span className="text-fg/70">{space.active_groups} grup</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted">
          {WIFI_LABELS[space.wifi_speed]}
        </span>
        {space.has_power && (
          <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted">
            ⚡ Power
          </span>
        )}
        {space.price_range && (
          <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-faint">
            {space.price_range}
          </span>
        )}
      </div>
    </div>
  );
}

function MarkerIcon({ selected }: { selected: boolean }) {
  const size = selected ? 32 : 24;
  const dotSize = selected ? 10 : 8;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#FFFFFF",
        border: "2.5px solid #07070A",
        boxShadow: selected
          ? "0 0 0 3px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.5)"
          : "0 2px 4px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s ease",
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

function ClusterIcon({ count }: { count: number }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.15)",
        border: "2px solid rgba(255,255,255,0.3)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      {count}
    </div>
  );
}

export function SpaceMap({
  spaces,
  selectedSpaceId,
  onSpaceSelect,
  className,
}: SpaceMapProps) {
  const spacesWithCoords = useMemo(
    () => spaces.filter((s) => s.latitude != null && s.longitude != null),
    [spaces],
  );
  const [popupSpaceId, setPopupSpaceId] = useState<string | null>(null);

  const center: LatLngExpression = useMemo(() => {
    if (spacesWithCoords.length === 0) return JAKARTA_CENTER;
    const lat =
      spacesWithCoords.reduce((s, sp) => s + sp.latitude!, 0) /
      spacesWithCoords.length;
    const lng =
      spacesWithCoords.reduce((s, sp) => s + sp.longitude!, 0) /
      spacesWithCoords.length;
    return [lat, lng];
  }, [spacesWithCoords]);

  const handleMarkerClick = useCallback(
    (id: string) => {
      setPopupSpaceId(id);
      onSpaceSelect?.(id);
    },
    [onSpaceSelect],
  );

  const popupSpace = spacesWithCoords.find((s) => s.id === popupSpaceId);

  if (spacesWithCoords.length === 0) {
    return (
      <div
        className={`relative flex h-full w-full flex-col items-center justify-center gap-2 rounded bg-surface ${className ?? ""}`}
      >
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
    );
  }

  return (
    <div className={`relative h-full w-full ${className ?? ""}`}>
      <Map center={center} zoom={12}>
        <MapTileLayer variant="dark" />
        <MapMarkerClusterGroup
          icon={(count) => <ClusterIcon count={count} />}
        >
          {spacesWithCoords.map((space) => {
            const isSelected =
              space.id === selectedSpaceId || space.id === popupSpaceId;
            return (
              <MapMarker
                key={space.id}
                position={[space.latitude!, space.longitude!]}
                icon={<MarkerIcon selected={isSelected} />}
                iconAnchor={[isSelected ? 16 : 12, isSelected ? 16 : 12]}
                popupAnchor={[0, isSelected ? -16 : -12]}
                eventHandlers={{
                  click: () => handleMarkerClick(space.id),
                }}
              >
                {popupSpace && popupSpace.id === space.id && (
                  <MapPopup>
                    <SpacePopupContent space={popupSpace} />
                  </MapPopup>
                )}
              </MapMarker>
            );
          })}
        </MapMarkerClusterGroup>
        <MapZoomControl />
        <MapAttribution />
      </Map>
    </div>
  );
}
