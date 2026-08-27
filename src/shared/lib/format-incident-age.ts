type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/** Expects the "incidents" i18n namespace (age.just_now / age.hours / age.days keys). */
export function formatIncidentAge(reportedAt: string, t: TranslateFn): string {
  const hours = Math.floor(
    (Date.now() - new Date(reportedAt).getTime()) / (1000 * 60 * 60),
  );
  if (hours < 1) return t("age.just_now");
  if (hours < 24) return t("age.hours", { count: hours });
  return t("age.days", { count: Math.floor(hours / 24) });
}
