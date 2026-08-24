import { useTranslation } from "react-i18next";

// Placeholder for Phase 2 task #3 — origin/destination form wired to the
// (not-yet-built) POST /itineraries, route + overlaid incidents display.
export function PlanTripPage() {
  const { t } = useTranslation("itinerary");
  return (
    <div className="flex h-full items-center justify-center text-slate-500">
      {t("calculate")}
    </div>
  );
}
