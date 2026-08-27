import { Routes, Route } from "react-router-dom";
import { Layout } from "@/shared/components/Layout";
import { MapPage } from "@/pages/MapPage";
import { ReportIncidentPage } from "@/pages/ReportIncidentPage";
import { PlanTripPage } from "@/pages/PlanTripPage";
import { AuthPage } from "@/pages/AuthPage";

// Route per Phase 2 flow (§3-4 of phase2_plan.md). Confirmation (task #4)
// has no dedicated route — it's an action on an incident already shown on
// the map, not a standalone page.
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MapPage />} />
        <Route path="report" element={<ReportIncidentPage />} />
        <Route path="plan" element={<PlanTripPage />} />
        <Route path="login" element={<AuthPage />} />
      </Route>
    </Routes>
  );
}
