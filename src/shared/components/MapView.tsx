import { useEffect, useRef } from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  LngLatBounds,
  type GeoJSONSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { env } from "@/shared/config/env";

// Cameroon's approximate geographic center — default view until a real
// itinerary or incident anchors the map (Phase 2 tasks #1-3 will recenter
// it dynamically).
const CAMEROON_CENTER: [number, number] = [12.35, 7.37];
const DEFAULT_ZOOM = 6;
const ROUTE_SOURCE_ID = "route-source";
const ROUTE_LAYER_ID = "route-layer";

export interface IncidentMarkerData {
  id: string;
  /** [longitude, latitude] */
  position: [number, number];
  color: string;
  onClick?: () => void;
}

/** Matches the backend's RouteGeometry shape (routing.provider.ts) — a GeoJSON LineString. */
export interface RouteLineString {
  type: "LineString";
  coordinates: [number, number][];
}

interface MapViewProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  /** [longitude, latitude] — controlled marker, e.g. the position picked in the report form. */
  markerPosition?: [number, number] | null;
  onClick?: (lngLat: { lng: number; lat: number }) => void;
  /** Multiple color-coded, clickable markers — used by the public incidents map / trip planning. */
  markers?: IncidentMarkerData[];
  /** Route line to draw, e.g. an itinerary's computed path. Map auto-fits to it when set. */
  route?: RouteLineString | null;
}

// Thin wrapper: MapLibre owns the DOM node directly (no React re-render
// touches it after mount), which is why the map instance lives in a ref
// and the mount effect has an empty dependency array. Markers/route are
// kept in separate effects so they can change on every render without
// reinitializing the whole map.
export function MapView({
  className,
  center,
  zoom,
  markerPosition,
  onClick,
  markers,
  route,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const incidentMarkersRef = useRef<Map<string, Marker>>(new Map());
  const mapLoadedRef = useRef(false);
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
    map.on("load", () => {
      mapLoadedRef.current = true;
    });
    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      incidentMarkersRef.current.forEach((marker) => marker.remove());
      incidentMarkersRef.current.clear();
      map.remove();
      mapRef.current = null;
      mapLoadedRef.current = false;
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markers) return;

    // Simple approach for MVP incident volumes: clear and rebuild on every
    // change. Revisit with an id-keyed diff if the marker count grows large
    // enough during the pilot for this to matter.
    incidentMarkersRef.current.forEach((marker) => marker.remove());
    incidentMarkersRef.current.clear();

    for (const markerData of markers) {
      const marker = new Marker({ color: markerData.color })
        .setLngLat(markerData.position)
        .addTo(map);
      if (markerData.onClick) {
        marker.getElement().addEventListener("click", (event) => {
          event.stopPropagation(); // don't also fire the map's own onClick (position picker)
          markerData.onClick?.();
        });
      }
      incidentMarkersRef.current.set(markerData.id, marker);
    }

    return () => {
      incidentMarkersRef.current.forEach((marker) => marker.remove());
      incidentMarkersRef.current.clear();
    };
  }, [markers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyRoute = () => {
      const existingSource = map.getSource(ROUTE_SOURCE_ID) as
        | GeoJSONSource
        | undefined;

      if (!route) {
        if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
        if (existingSource) map.removeSource(ROUTE_SOURCE_ID);
        return;
      }

      const geojson = {
        type: "Feature" as const,
        properties: {},
        geometry: route,
      };
      if (existingSource) {
        existingSource.setData(geojson);
      } else {
        map.addSource(ROUTE_SOURCE_ID, { type: "geojson", data: geojson });
        map.addLayer({
          id: ROUTE_LAYER_ID,
          type: "line",
          source: ROUTE_SOURCE_ID,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#2563eb", "line-width": 4 },
        });
      }

      const bounds = route.coordinates.reduce(
        (b, coord) => b.extend(coord as [number, number]),
        new LngLatBounds(route.coordinates[0], route.coordinates[0]),
      );
      map.fitBounds(bounds, { padding: 48, maxZoom: 14 });
    };

    if (mapLoadedRef.current) {
      applyRoute();
    } else {
      map.once("load", applyRoute);
    }
  }, [route]);

  return <div ref={containerRef} className={className ?? "h-full w-full"} />;
}
