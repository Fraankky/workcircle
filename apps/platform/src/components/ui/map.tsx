// Adapted from shadcn-map (https://shadcn-map.vercel.app/docs)
// Modifications for Vite compatibility:
//   - Removed "use client" directive (Vite/React, not Next.js)
//   - Removed next-themes dependency (variant prop: "light" | "dark")
//   - Removed unused components: MapLayers, MapDraw, MapSearch, MapFullscreen
//   - Removed lucide-react icons dependency for zoom control (uses plain SVG)
//   - useLeaflet simplified (no leaflet-draw / leaflet.fullscreen)
import type {
  DivIconOptions,
  LatLngExpression,
  Marker,
  MarkerCluster,
  Popup,
  TileLayer,
  Tooltip,
} from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import type {} from "leaflet.markercluster";
import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type Ref,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  useMap,
  useMapEvents,
  type MapContainerProps,
  type MarkerProps,
  type PopupProps,
  type TileLayerProps,
  type TooltipProps,
} from "react-leaflet";
import type { MarkerClusterGroupProps } from "react-leaflet-markercluster";
import { cn } from "../../lib/utils";

// ── Lazy component factory (avoids Leaflet SSR/hydration issues) ──────────────

function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(factory);

  return (props: React.ComponentProps<T>) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
      <Suspense>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

const LeafletMapContainer = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({ default: mod.MapContainer }))
);
const LeafletTileLayer = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({ default: mod.TileLayer }))
);
const LeafletMarker = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({ default: mod.Marker }))
);
const LeafletPopup = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({ default: mod.Popup }))
);
const LeafletTooltip = createLazyComponent(() =>
  import("react-leaflet").then((mod) => ({ default: mod.Tooltip }))
);
const LeafletMarkerClusterGroup = createLazyComponent(async () =>
  import("react-leaflet-markercluster").then((mod) => ({
    default: mod.default,
  }))
);

// ── useLeaflet ────────────────────────────────────────────────────────────────

function useLeaflet() {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    if (L) return;
    if (typeof window === "undefined") return;
    import("leaflet").then((mod) => setL(mod.default));
  }, [L]);

  return { L };
}

// ── MapControlContainer ───────────────────────────────────────────────────────

function MapControlContainer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { L } = useLeaflet();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!L) return;
    const element = containerRef.current;
    if (!element) return;
    L.DomEvent.disableClickPropagation(element);
    L.DomEvent.disableScrollPropagation(element);
  }, [L]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute z-[1000] size-fit cursor-default", className)}
      {...props}
    />
  );
}

// ── Map (container) ───────────────────────────────────────────────────────────

function Map({
  zoom = 13,
  maxZoom = 18,
  className,
  ...props
}: Omit<MapContainerProps, "zoomControl"> & {
  center: LatLngExpression;
  ref?: Ref<import("leaflet").Map>;
}) {
  return (
    <LeafletMapContainer
      zoom={zoom}
      maxZoom={maxZoom}
      attributionControl={false}
      zoomControl={false}
      className={cn("z-50 size-full min-h-64 flex-1 rounded", className)}
      {...props}
    />
  );
}

// ── MapTileLayer ──────────────────────────────────────────────────────────────

const CARTO_LIGHT_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
const CARTO_DARK_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";
const CARTO_ATTRIBUTION =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>';

function MapTileLayer({
  variant = "dark",
  url,
  attribution = CARTO_ATTRIBUTION,
  ...props
}: Partial<TileLayerProps> & {
  variant?: "light" | "dark";
  ref?: Ref<TileLayer>;
}) {
  const map = useMap();
  if (map.attributionControl) {
    map.attributionControl.setPrefix("");
  }
  const tileUrl = url ?? (variant === "dark" ? CARTO_DARK_URL : CARTO_LIGHT_URL);
  return <LeafletTileLayer url={tileUrl} attribution={attribution} {...props} />;
}

// ── MapMarker ─────────────────────────────────────────────────────────────────

function MapMarker({
  icon,
  iconAnchor = [12, 12],
  bgPos,
  popupAnchor,
  tooltipAnchor,
  ...props
}: Omit<MarkerProps, "icon"> &
  Pick<DivIconOptions, "iconAnchor" | "bgPos" | "popupAnchor" | "tooltipAnchor"> & {
    icon?: ReactNode;
    ref?: Ref<Marker>;
  }) {
  const { L } = useLeaflet();
  if (!L) return null;

  const defaultIconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

  return (
    <LeafletMarker
      icon={L.divIcon({
        html: icon ? renderToStaticMarkup(icon) : defaultIconHtml,
        iconAnchor,
        ...(bgPos ? { bgPos } : {}),
        ...(popupAnchor ? { popupAnchor } : {}),
        ...(tooltipAnchor ? { tooltipAnchor } : {}),
      })}
      riseOnHover
      {...props}
    />
  );
}

// ── MapMarkerClusterGroup ─────────────────────────────────────────────────────

function MapMarkerClusterGroup({
  icon,
  ...props
}: Omit<MarkerClusterGroupProps, "iconCreateFunction"> & {
  children: ReactNode;
  icon?: (markerCount: number) => ReactNode;
}) {
  const { L } = useLeaflet();
  if (!L) return null;

  const iconCreateFunction = icon
    ? (cluster: MarkerCluster) => {
        const count = cluster.getChildCount();
        const iconNode = icon(count);
        return L.divIcon({ html: renderToStaticMarkup(iconNode) });
      }
    : undefined;

  return (
    <LeafletMarkerClusterGroup
      iconCreateFunction={iconCreateFunction}
      {...props}
    />
  );
}

// ── MapPopup ──────────────────────────────────────────────────────────────────

function MapPopup({
  className,
  ...props
}: Omit<PopupProps, "content"> & { ref?: Ref<Popup> }) {
  return (
    <LeafletPopup
      className={cn(
        "z-50 w-64 rounded border border-border bg-surface p-0 font-sans shadow-xl",
        className
      )}
      {...props}
    />
  );
}

// ── MapTooltip ────────────────────────────────────────────────────────────────

function MapTooltip({
  className,
  ...props
}: Omit<TooltipProps, "offset"> & {
  ref?: Ref<Tooltip>;
}) {
  return (
    <LeafletTooltip
      className={cn(
        "z-50 w-fit rounded border-none bg-overlay px-2 py-1 text-xs text-fg shadow-none",
        className
      )}
      direction="top"
      offset={[0, -14]}
      opacity={1}
      {...props}
    />
  );
}

// ── MapZoomControl ────────────────────────────────────────────────────────────

function MapZoomControl({
  position = "bottom-3 right-3",
  className,
}: {
  position?: string;
  className?: string;
}) {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => setZoomLevel(map.getZoom()),
  });

  return (
    <MapControlContainer className={cn(position, className)}>
      <div className="flex flex-col overflow-hidden rounded border border-border bg-surface shadow-md">
        <button
          type="button"
          aria-label="Zoom in"
          disabled={zoomLevel >= map.getMaxZoom()}
          onClick={() => map.zoomIn()}
          className="flex h-8 w-8 items-center justify-center border-b border-border text-muted hover:bg-overlay hover:text-fg disabled:opacity-40"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          disabled={zoomLevel <= map.getMinZoom()}
          onClick={() => map.zoomOut()}
          className="flex h-8 w-8 items-center justify-center text-muted hover:bg-overlay hover:text-fg disabled:opacity-40"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </MapControlContainer>
  );
}

// ── MapAttribution ────────────────────────────────────────────────────────────

function MapAttribution({
  position = "bottom-1 left-1",
  className,
}: {
  position?: string;
  className?: string;
}) {
  return (
    <MapControlContainer className={cn(position, className)}>
      <p className="rounded bg-bg/80 px-1 py-0.5 text-[10px] text-faint">
        &copy;{" "}
        <a
          href="http://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          OpenStreetMap
        </a>{" "}
        &copy;{" "}
        <a
          href="https://carto.com/attributions"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          CARTO
        </a>
      </p>
    </MapControlContainer>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────

export {
  Map,
  MapAttribution,
  MapMarker,
  MapMarkerClusterGroup,
  MapPopup,
  MapTileLayer,
  MapTooltip,
  MapZoomControl,
};
