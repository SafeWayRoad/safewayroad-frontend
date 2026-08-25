import { useEffect, useRef } from "react";
import { Map as MapLibreMap, Marker, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { env } from "@/shared/config/env";

// Cameroon's approximate geographic center — default view until a real
// itinerary or incident anchors the map (Phase 2 tasks #1-3 will recenter
// it dynamically).
const CAMEROON_CENTER: [number, number] = [12.35, 7.37];
const DEFAULT_ZOOM = 6;

interface MapViewProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  /** [longitude, latitude] — controlled marker, e.g. the position picked in the report form. */
  markerPosition?: [number, number] | null;
  onClick?: (lngLat: { lng: number; lat: number }) => void;
}

// Thin wrapper: MapLibre owns the DOM node directly (no React re-render
// touches it after mount), which is why the map instance lives in a ref
// and the mount effect has an empty dependency array. The marker is kept
// in a separate effect so a controlled position (or a click handler) can
// change on every render without reinitializing the whole map.
export function MapView({
  className,
  center,
  zoom,
  markerPosition,
  onClick,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  // onClick is read through a ref inside the map's "click" listener so the
  // mount effect doesn't need onClick as a dependency (which would force a
  // remount on every render of the parent form).
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = new MapLibreMap({
      container,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${env.VITE_MAPTILER_API_KEY}`,
      center: center ?? CAMEROON_CENTER,
      zoom: zoom ?? DEFAULT_ZOOM,
    });
    map.addControl(new NavigationControl(), "top-right");
    map.on("click", (event) => onClickRef.current?.(event.lngLat));
    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!markerPosition) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    if (markerRef.current) {
      markerRef.current.setLngLat(markerPosition);
    } else {
      markerRef.current = new Marker({ color: "#dc2626" })
        .setLngLat(markerPosition)
        .addTo(map);
    }
    map.easeTo({ center: markerPosition });
  }, [markerPosition]);

  return <div ref={containerRef} className={className ?? "h-full w-full"} />;
}
