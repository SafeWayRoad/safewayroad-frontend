import { useTranslation } from "react-i18next";

// Placeholder for Phase 2 task #1 — reporting form (position, type,
// direction, road status, compressed photo) wired to POST /incidents.
export function ReportIncidentPage() {
  const { t } = useTranslation("incidents");
  return (
    <div className="flex h-full items-center justify-center text-slate-500">
      {t("report_incident")}
    </div>
  );
}
