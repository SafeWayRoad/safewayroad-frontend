import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "./locales/en/common.json";
import incidentsEn from "./locales/en/incidents.json";
import itineraryEn from "./locales/en/itinerary.json";
import authEn from "./locales/en/auth.json";
import commonFr from "./locales/fr/common.json";
import incidentsFr from "./locales/fr/incidents.json";
import itineraryFr from "./locales/fr/itinerary.json";
import authFr from "./locales/fr/auth.json";

// Namespaces are split by functional domain (mirrors the backend module
// split: incidents, itineraries...) so each Phase 2 task only touches its
// own translation file. `fallbackLng: "en"` follows the decision made at
// the end of Phase 1 (cf. CHANGELOG §0.2.0): English by default, with a
// French toggle — not the other way around.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEn,
        incidents: incidentsEn,
        itinerary: itineraryEn,
        auth: authEn,
      },
      fr: {
        common: commonFr,
        incidents: incidentsFr,
        itinerary: itineraryFr,
        auth: authFr,
      },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    ns: ["common", "incidents", "itinerary", "auth"],
    defaultNS: "common",
    interpolation: { escapeValue: false }, // React already escapes output
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
