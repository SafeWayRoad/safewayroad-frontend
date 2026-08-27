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
- Formulaire de signalement d'incident (`ReportIncidentPage.tsx`) : géolocalisation navigateur ou
  sélection manuelle sur carte, type/sens/état de la voie, photo compressée côté client
  (redimensionnement + réencodage JPEG via Canvas), soumission vers `POST /incidents`
- `MapView.tsx` étendu : marqueur contrôlé et gestionnaire de clic (`onClick`), réutilisable pour
  toute future sélection de position sur carte (ex. planification de trajet, tâche #3)
  - Carte publique des incidents actifs (`MapPage.tsx`) : marqueurs colorés par état de la voie,
    filtrage par axe (N1/N3/N4) appliqué côté serveur, fiche détaillée au clic (type, axe, PK, sens,
    ancienneté, photo)
- `MapView.tsx` étendu : support de plusieurs marqueurs cliquables (`markers`), en plus du
  marqueur unique déjà utilisé par le formulaire de signalement
- `shared/api/incidents.ts` : client pour `GET /incidents`, réutilisable pour la planification de
  trajet (tâche #3) et la confirmation communautaire (tâche #4)
- UI d'authentification (`AuthPage.tsx`) : connexion et inscription sur un seul écran (bascule
  onglet), branchée sur POST /auth/login et POST /auth/register (déjà livrés en Phase 1)
- Store d'authentification (`auth.store.ts`, Zustand + persist localStorage) : token d'accès,
  refresh token et utilisateur courant, persistés entre les sessions
- `auth-fetch.ts` : wrapper fetch attachant automatiquement l'en-tête Authorization — réutilisable
  pour les futurs appels authentifiés (POST /itineraries, tâche #3)
- Nav shell (`Layout.tsx`) : affichage de l'état connecté/déconnecté, bouton de déconnexion
- Nouveau namespace i18n `auth` (EN/FR)
- UI de planification de trajet (`PlanTripPage.tsx`) : sélection départ/arrivée sur la carte,
  calcul via POST /itineraries, tracé et incidents superposés affichés, sauvegarde en favori.
  Nécessite un compte (redirection vers /login sinon)
- `MapView.tsx` étendu : rendu d'un tracé GeoJSON (`route`) avec ajustement automatique du zoom
- Extraction en commun de `ROAD_STATUS_COLORS`, `formatIncidentAge` et `IncidentDetailCard`
  (auparavant dupliqués dans `MapPage.tsx`) — réutilisés par la carte publique et la planification
  de trajet, prêts pour la confirmation communautaire (tâche #4)

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
