# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [Unreleased]

---

## [0.1.0] — 2026-09-03 — Phase 0 & Phase 2 — Coquille PWA + Fonctionnalités cœur

Premier tag du dépôt frontend — regroupe la coquille PWA initiale (Phase 0) et l'ensemble des
fonctionnalités cœur livrées en Phase 2 (signalement, carte publique, authentification,
planification de trajet, confirmation communautaire), le frontend n'ayant jamais été taggé
séparément après la Phase 0.

### Ajouté — Coquille PWA (Phase 0)

- Scaffold initial : Vite + React 19 + TypeScript
- `vite-plugin-pwa` configuré (manifest, cache-first sur les tuiles MapTiler, `devOptions` activé
  pour inspection du service worker en développement)
- Tailwind CSS v4 (via `@tailwindcss/vite`, pas de fichier de config séparé)
- Internationalisation (`react-i18next`) : anglais par défaut, bascule français, namespaces
  `common`/`incidents`/`itinerary` alignés sur les modules backend
- Routing (`react-router-dom`) : routes `/` (carte), `/report` (signalement), `/plan`
  (planification de trajet)
- Nav shell (`Layout.tsx`) avec sélecteur de langue
- TanStack Query : instance partagée (`query-client.ts`)
- Validation Zod des variables d'environnement `VITE_*` (`shared/config/env.ts`), même pattern que
  le backend
- Alias d'import `@/` (cohérent entre `vite.config.ts` et `tsconfig.app.json`)

### Ajouté — Signalement d'incident

- Formulaire de signalement (`ReportIncidentPage.tsx`) : géolocalisation navigateur ou sélection
  manuelle sur carte, type/sens/état de la voie, photo compressée côté client (redimensionnement +
  réencodage JPEG via Canvas), soumission vers `POST /incidents`
- `MapView.tsx` : marqueur contrôlé et gestionnaire de clic (`onClick`), réutilisable pour toute
  future sélection de position sur carte

### Ajouté — Carte publique

- Carte des incidents actifs (`MapPage.tsx`) : marqueurs colorés par état de la voie, filtrage par
  axe appliqué côté serveur, fiche détaillée au clic (type, axe, PK, sens, ancienneté, photo)
- `MapView.tsx` étendu : support de plusieurs marqueurs cliquables (`markers`)
- `shared/api/incidents.ts` : client pour `GET /incidents`
- `shared/api/axes.ts` : client pour `GET /route-axes` — le filtre d'axes charge désormais la
  liste dynamiquement (pageSize=100, une seule requête) au lieu d'un tableau codé en dur
  (`["N1","N3","N4"]`, devenu obsolète après l'import OSM backend couvrant N1-N21)

### Ajouté — Authentification

- UI connexion/inscription (`AuthPage.tsx`), branchée sur `POST /auth/login` et
  `POST /auth/register`
- Store d'authentification (`auth.store.ts`, Zustand + persist localStorage) : token d'accès,
  refresh token et utilisateur courant, persistés entre les sessions
- `auth-fetch.ts` : wrapper fetch attachant automatiquement l'en-tête Authorization
- Nav shell (`Layout.tsx`) : affichage de l'état connecté/déconnecté, bouton de déconnexion
- Nouveau namespace i18n `auth` (EN/FR)
- Connexion Google (`GoogleLogin`, `@react-oauth/google`) : bouton unique visible sur les onglets
  connexion et inscription — `POST /auth/google` gère transparemment la connexion ou la création
  de compte (backend issue #15)
- Input téléphone international (`react-phone-number-input`), Cameroun pré-sélectionné, format
  E.164 — remplace le champ texte simple

### Ajouté — Planification de trajet

- UI de planification (`PlanTripPage.tsx`) : sélection départ/arrivée sur la carte, calcul via
  `POST /itineraries`, tracé et incidents superposés affichés, sauvegarde en favori. Nécessite un
  compte (redirection vers `/login` sinon)
- Champ nom du trajet obligatoire, suit le changement cassant backend sur `POST /itineraries`
  (backend issue #<numéro-nom-itinéraire>)
- `MapView.tsx` étendu : rendu d'un tracé GeoJSON (`route`) avec ajustement automatique du zoom
- `shared/api/itineraries.ts` : client pour `POST /itineraries`, `POST /itineraries/{id}/favorite`,
  et `renameItinerary` (client pour `PATCH /itineraries/{id}`, pas encore branché à une UI de
  renommage)

### Ajouté — Confirmation communautaire

- Confirmation intégrée à `IncidentDetailCard.tsx` (partagée entre la carte publique et la
  planification de trajet) : boutons "toujours là"/"dégagé" vers
  `POST /incidents/{id}/confirmations`, mise en évidence visuelle au-delà de 24h sans résolution
  (cahier des charges §4.4)
- `format-incident-age.ts` : `formatIncidentAge` et `isIncidentStale` (seuil d'alerte 24h)
- `shared/api/confirmations.ts` : client pour `POST /incidents/{id}/confirmations`

### Refactors notables

- Extraction en commun de `ROAD_STATUS_COLORS`, `formatIncidentAge`, `isIncidentStale` et
  `IncidentDetailCard` — auparavant dupliqués/isolés, réutilisés par la carte publique et la
  planification de trajet
- `MapView.tsx` étendu trois fois au fil des tâches : marqueur unique contrôlé (signalement) →
  marqueurs multiples cliquables (carte publique) → tracé GeoJSON avec ajustement de zoom
  (itinéraires)

### Vérifié

- `tsc -b` (mode strict) : aucune erreur
- `npm run build` : build de production réussi, service worker et manifest PWA générés

### Connu — à faire

- Icônes PWA réelles (`pwa-192x192.png`, `pwa-512x512.png`) — le manifest les référence mais les
  fichiers ne sont pas encore présents dans `public/`
- File d'attente offline pour `POST /incidents` (IndexedDB + Background Sync) — la stratégie de
  cache Workbox actuelle ne couvre que les assets statiques et les tuiles de carte
- Identité visuelle (palette, typographie) non définie — la coquille reste volontairement neutre
- `GET /incidents` est désormais paginé côté backend (issue #18) — le frontend ignore `meta` pour
  l'instant et ne récupère que la première page (20 incidents). Non bloquant tant que le volume
  réel reste sous ce seuil ; à traiter si le pilote dépasse 20 incidents actifs simultanés
