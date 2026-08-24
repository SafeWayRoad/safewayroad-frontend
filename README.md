# SafeWayRoad — Frontend

PWA (Progressive Web App) de signalement d'incidents routiers et d'assistance aux usagers des
Routes Nationales du Cameroun. Consomme l'API du dépôt backend
[`safewayroad-backend`](https://github.com/<compte>/safewayroad-backend).

---

## 🧱 Stack technique

- **Framework** : React 19 + TypeScript, via Vite
- **PWA / Service Worker** : `vite-plugin-pwa` (Workbox) — cache des tuiles de carte et des assets
  statiques, base de la file d'attente hors ligne pour les signalements (cf. cahier des charges
  §7.4)
- **Style** : Tailwind CSS v4
- **Cartographie** : MapLibre GL JS + tuiles MapTiler, intégration directe (pas de wrapper React)
- **Données / cache réseau** : TanStack Query
- **État client léger** : Zustand (si besoin — la coquille s'appuie pour l'instant sur
  `useState`/Context)
- **Routing** : React Router
- **Internationalisation** : `react-i18next` — anglais par défaut, bascule français (décision actée
  en Phase 1 du backend, cf. `CHANGELOG.md` du backend §0.2.0)
- **Validation d'environnement** : Zod, même pattern que le backend (`src/shared/config/env.ts`)

Choix détaillés et alternatives écartées (Next.js notamment) : voir la discussion d'architecture
frontend au démarrage de la Phase 2 (à archiver dans `docs/` si besoin).

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- Une clé API MapTiler (offre gratuite : [maptiler.com](https://www.maptiler.com))
- Le backend `safewayroad-backend` lancé en local (`http://localhost:3000` par défaut)

### Installation

```bash
npm install
cp .env.example .env.local
```

Renseigne `VITE_MAPTILER_API_KEY` dans `.env.local`. `VITE_API_BASE_URL` pointe par défaut vers le
backend local.

> ⚠️ Seules les variables préfixées `VITE_` sont exposées au bundle client — ne jamais y placer de
> secret serveur (ex. la clé OpenRouteService, qui reste côté backend derrière `RoutingProvider`).

### Lancer le serveur de développement

```bash
npm run dev
```

L'app démarre sur `http://localhost:5173`.

### Build de production

```bash
npm run build
npm run preview   # sert le build localement pour vérification
```

---

## 📁 Structure du projet

```
src/
  main.tsx                      Point d'entrée — providers (i18n, React Query, Router)
  App.tsx                       Déclaration des routes
  i18n/
    index.ts                    Config i18next (fallback EN, bascule FR)
    locales/
      en/ , fr/                 Traductions par domaine (common, incidents, itinerary...)
  pages/
    MapPage.tsx                 Carte publique (Phase 2 tâche #2)
    ReportIncidentPage.tsx      Formulaire de signalement (Phase 2 tâche #1)
    PlanTripPage.tsx            Planification de trajet (Phase 2 tâche #3)
  shared/
    components/
      Layout.tsx                 Nav shell commune à toutes les routes
      LanguageSwitcher.tsx        Sélecteur EN/FR
    config/
      env.ts                     Validation Zod des variables VITE_*
    lib/
      query-client.ts             Instance TanStack Query partagée
public/                          Assets statiques, icônes PWA
vite.config.ts                   Tailwind, alias @/, configuration vite-plugin-pwa
GIT_WORKFLOW.md
CHANGELOG.md
```

---

## 🌳 Contribuer

Stratégie de branches, convention de commits (Conventional Commits) et correspondance
versions/phases : voir [`GIT_WORKFLOW.md`](./GIT_WORKFLOW.md) — mêmes conventions que le dépôt
backend, pour rester cohérent entre les deux dépôts.

---

## 📈 Suivi d'avancement

Suivi via [`CHANGELOG.md`](./CHANGELOG.md) et les Milestones GitHub du dépôt.
