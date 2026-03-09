import { useState, useCallback } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { WIFI_LABELS } from "../../../lib/constants";
import type { Space } from "../types";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;
const JAKARTA_CENTER = { longitude: 106.8456, latitude: -6.2088 };
const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

interface SpaceMapProps {
  spaces: Space[];
  selectedSpaceId?: string;
  onSpaceSelect?: (id: string) => void;
  className?: string;
}

function SpaceMarker({
  space,
  isSelected,
  onClick,
}: {
  space: Space;
  isSelected: boolean;
  onClick: () => void;
}) {
  const size = isSelected ? 32 : 24;
  const dotSize = isSelected ? 10 : 8;

  return (
    <Marker longitude={space.longitude!} latitude={space.latitude!} anchor="center" onClick={(e) => { e.originalEvent.stopPropagation(); onClick(); }}>
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
    </Marker>
  );
}

function SpacePopupContent({ space }: { space: Space }) {
  return (
    <div style={{ minWidth: 200, fontFamily: "inherit" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.3 }}>{space.name}</p>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.50)" }}>{space.area}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "rgba(255,255,255,0.50)", marginBottom: 6 }}>
        <span style={{ color: "rgba(255,210,100,0.90)", fontWeight: 600 }}>★ {space.rating.toFixed(1)}</span>
        {space.seat_count && <span>{space.seat_count} kursi</span>}
        {space.active_groups > 0 && (
          <span style={{ color: "rgba(255,255,255,0.70)" }}>{space.active_groups} grup</span>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {WIFI_LABELS[space.wifi_speed]}
        </span>
        {space.has_power && (
          <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.08)" }}>
            ⚡ Power
          </span>
        )}
        {space.price_range && (
          <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {space.price_range}
          </span>
        )}
      </div>
    </div>
  );
}

export function SpaceMap({ spaces, selectedSpaceId, onSpaceSelect, className }: SpaceMapProps) {
  const spacesWithCoords = spaces.filter((s) => s.latitude != null && s.longitude != null);
  const [popupSpaceId, setPopupSpaceId] = useState<string | null>(null);

  const center =
    spacesWithCoords.length > 0
      ? {
          longitude: spacesWithCoords.reduce((s, sp) => s + sp.longitude!, 0) / spacesWithCoords.length,
          latitude: spacesWithCoords.reduce((s, sp) => s + sp.latitude!, 0) / spacesWithCoords.length,
        }
      : JAKARTA_CENTER;

  const handleMarkerClick = useCallback(
    (id: string) => {
      setPopupSpaceId(id);
      onSpaceSelect?.(id);
    },
    [onSpaceSelect],
  );

  const popupSpace = spacesWithCoords.find((s) => s.id === popupSpaceId);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`relative h-full w-full flex flex-col items-center justify-center gap-2 rounded bg-surface ${className ?? ""}`}>
        <p className="text-xs text-faint">Mapbox token tidak ditemukan</p>
      </div>
    );
  }

  if (spacesWithCoords.length === 0) {
    return (
      <div className={`relative h-full w-full flex flex-col items-center justify-center gap-2 rounded bg-surface ${className ?? ""}`}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-border">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p className="text-xs font-medium text-faint">Tidak ada lokasi tersedia</p>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className ?? ""}`}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{ ...center, zoom: 12 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
        onClick={() => setPopupSpaceId(null)}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {spacesWithCoords.map((space) => (
          <SpaceMarker
            key={space.id}
            space={space}
            isSelected={space.id === selectedSpaceId || space.id === popupSpaceId}
            onClick={() => handleMarkerClick(space.id)}
          />
        ))}

        {popupSpace && (
          <Popup
            longitude={popupSpace.longitude!}
            latitude={popupSpace.latitude!}
            anchor="bottom"
            offset={20}
            closeButton={false}
            onClose={() => setPopupSpaceId(null)}
            style={{ padding: 0 }}
          >
            <SpacePopupContent space={popupSpace} />
          </Popup>
        )}
      </Map>
    </div>
  );
}
