# Workflow Git & GitHub — SafeWayRoad Frontend

Ce dépôt suit exactement les mêmes conventions que
[`safewayroad-backend`](https://github.com/<compte>/safewayroad-backend) — objectif : pouvoir
naviguer entre les deux dépôts sans changer de réflexe. Ce document est la version courte ; se
référer au `GIT_WORKFLOW.md` du backend pour le détail de chaque justification.

---

## 1. Branches

| Branche | Rôle | Protégée ? |
|---|---|---|
| `main` | Toujours stable. Reflète l'état d'une version publiée (taggée). | Oui |
| `develop` | Intégration du travail en cours pour la version à venir. | Recommandé une fois en équipe |
| `feature/<nom-court>` | Une fonctionnalité ou tâche précise. Part de `develop`. | Non |
| `hotfix/<nom-court>` | Correctif urgent post-lancement. Part de `main`. | Non |

**Exemples de noms de branche** (alignés sur les tâches de `phase2_plan.md`) :
`feature/pwa-shell`, `feature/incident-report-flow`, `feature/public-map`,
`feature/trip-planning`, `feature/community-confirmation`.

---

## 2. Convention de commits (Conventional Commits)

Identique au backend :

```
<type>(<portée optionnelle>): <description courte>
```

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `chore` | Tâche technique sans impact fonctionnel (config, dépendances) |
| `docs` | Documentation uniquement |
| `refactor` | Changement de code sans changement de comportement |
| `test` | Ajout ou modification de tests |

**Exemples :**
```
feat(map): affiche les marqueurs d'incidents actifs sur la carte
fix(i18n): corrige la clé de traduction manquante sur le bouton de confirmation
chore(pwa): met à jour la stratégie de cache Workbox pour les tuiles MapTiler
```

---

## 3. Issues et Milestones

Une issue par tâche de `phase2_plan.md` §3, rattachée au milestone `v0.3.0 — Fonctionnalités
cœur` — le même milestone que côté backend, les deux dépôts avançant sur la même phase. Labels
suggérés : `pwa`, `carte`, `signalement`, `itineraires`, `i18n`, `bug`, `documentation`.

---

## 4. Releases GitHub

Même logique que le backend : tag de version → Release GitHub avec les fonctionnalités livrées
(reprises du `CHANGELOG.md`).

---

## 5. CHANGELOG.md

Format [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), section `Unreleased` mise à jour
à chaque PR significative.

---

## 6. Réglages à faire une fois sur GitHub (interface web)

1. **Settings → Branches → Add branch protection rule** sur `main` (PR requise, force-push désactivé).
2. **Settings → General → Default branch** : `develop`.
3. Créer les labels et milestones listés en §3.
