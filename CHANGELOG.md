# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [Unreleased]

### Ajouté

- Scaffold initial : Vite + React 19 + TypeScript
- `vite-plugin-pwa` configuré (manifest, cache-first sur les tuiles MapTiler, `devOptions` activé
  pour inspection du service worker en développement)
- Tailwind CSS v4 (via `@tailwindcss/vite`, pas de fichier de config séparé)
- Internationalisation (`react-i18next`) : anglais par défaut, bascule français, namespaces
  `common`/`incidents`/`itinerary` alignés sur les modules backend
- Routing (`react-router-dom`) : routes `/` (carte), `/report` (signalement), `/plan`
  (planification de trajet) — pages placeholder pour les tâches #1-3 de la Phase 2
- Nav shell (`Layout.tsx`) avec sélecteur de langue
- TanStack Query : instance partagée (`query-client.ts`), pas encore de requête branchée
- Validation Zod des variables d'environnement `VITE_*` (`shared/config/env.ts`), même pattern que
  le backend
- Alias d'import `@/` (cohérent entre `vite.config.ts` et `tsconfig.app.json`)

### Vérifié

- `tsc -b` (mode strict) : aucune erreur
- `npm run build` : build de production réussi, service worker et manifest PWA générés

### Connu — à faire

- Icônes PWA réelles (`pwa-192x192.png`, `pwa-512x512.png`) — le manifest les référence mais les
  fichiers ne sont pas encore présents dans `public/` ; à produire lors de la passe de design
  visuel
- File d'attente offline pour `POST /incidents` (IndexedDB + Background Sync) — la stratégie de
  cache Workbox actuelle ne couvre que les assets statiques et les tuiles de carte
- Identité visuelle (palette, typographie) non définie — la coquille reste volontairement neutre
  tant qu'il n'y a pas de contenu réel à designer autour

---

## [0.1.0] — Phase 0 / démarrage Phase 2 — Coquille PWA

_Voir section [Unreleased] ci-dessus — sera figée sous ce numéro au premier tag._
