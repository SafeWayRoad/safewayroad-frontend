import { useTranslation } from "react-i18next";

// Placeholder for Phase 2 task #2 — MapLibre GL JS + MapTiler tiles,
// active-incident markers from GET /incidents, filtering by axis.
export function MapPage() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full items-center justify-center text-slate-500">
      {t("nav.map")} — {t("app_name")}
    </div>
  );
}
