import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <label className="flex items-center gap-2 text-sm text-slate-500">
      <span className="sr-only">{t("language.label")}</span>
      <select
        value={i18n.resolvedLanguage}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        className="rounded border border-slate-300 bg-transparent px-2 py-1"
      >
        <option value="en">{t("language.en")}</option>
        <option value="fr">{t("language.fr")}</option>
      </select>
    </label>
  );
}
