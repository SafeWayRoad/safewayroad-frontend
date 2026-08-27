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

/**
 * Cahier des charges §4.4: "seuil d'alerte renforcée au-delà d'une durée
 * définie (à calibrer, ex. 24h)" for obstacles still unresolved. 24h chosen
 * as the starting threshold, same spirit as the backend's documented
 * CLEARED_RESOLUTION_THRESHOLD constant — revisit with real pilot data.
 */
export function isIncidentStale(
  reportedAt: string,
  thresholdHours = 24,
): boolean {
  const hours =
    (Date.now() - new Date(reportedAt).getTime()) / (1000 * 60 * 60);
  return hours >= thresholdHours;
}
