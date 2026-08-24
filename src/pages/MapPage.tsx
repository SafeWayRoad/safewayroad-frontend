import { MapView } from "@/shared/components/MapView";

// Base map for Phase 2 task #0 (coquille PWA). Task #2 layers active-incident
// markers (GET /incidents) and axis filtering (N1/N3/N4) on top of this.
export function MapPage() {
  return <MapView className="h-full w-full" />;
}
