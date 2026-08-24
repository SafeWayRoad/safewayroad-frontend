import { useEffect, useRef } from "react";
import { Map as MapLibreMap, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { env } from "@/shared/config/env";

// Cameroon's approximate geographic center — default view until a real
// itinerary or incident anchors the map (Phase 2 tasks #1-3 will recenter
// it dynamically).
const CAMEROON_CENTER: [number, number] = [12.35, 7.37];
const DEFAULT_ZOOM = 6;

interface MapViewProps {
  className?: string;
}

// Thin wrapper: MapLibre owns the DOM node directly (no React re-render
// touches it after mount), which is why the map instance lives in a ref
// and the effect has an empty dependency array — this stays a single
// mount/unmount, not something that reinitializes on every render.
export function MapView({ className }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = new MapLibreMap({
      container,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${env.VITE_MAPTILER_API_KEY}`,
      center: CAMEROON_CENTER,
      zoom: DEFAULT_ZOOM,
    });
    map.addControl(new NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={className ?? "h-full w-full"} />;
}
