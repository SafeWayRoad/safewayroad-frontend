#!/usr/bin/env bash
# Crée les labels GitHub du projet frontend, à exécuter une seule fois après
# la création du dépôt. Les milestones ne sont PAS recréés ici : ce dépôt
# partage les mêmes jalons de version que le backend (ex. v0.3.0 —
# Fonctionnalités cœur) — les créer une fois côté backend suffit
# conceptuellement, mais GitHub ne partage pas les milestones entre dépôts :
# si tu veux un suivi par milestone ici aussi, relance la même commande `gh
# api ... milestones` que dans safewayroad-backend/scripts/setup-github.sh.
#
# Prérequis :
#   - GitHub CLI installé : https://cli.github.com
#   - Authentifié : gh auth login
#   - Exécuté depuis la racine du dépôt (une fois `git remote add origin ...` fait)
#
# Usage :
#   chmod +x scripts/setup-github.sh
#   ./scripts/setup-github.sh

set -e

echo "Création des labels..."

gh label create "pwa"            --color "1F3864" --description "Coquille PWA, service worker, manifest" --force
gh label create "carte"          --color "2E5FA3" --description "Carte publique et affichage des incidents" --force
gh label create "signalement"    --color "D85A30" --description "Formulaire et flux de signalement d'incident" --force
gh label create "itineraires"    --color "0F6E56" --description "Planification et suivi de trajet" --force
gh label create "i18n"           --color "633806" --description "Internationalisation (EN/FR)" --force
gh label create "documentation"  --color "595959" --description "Documentation du projet" --force
# "bug" existe déjà par défaut sur GitHub — on ajuste juste sa description.
gh label create "bug"            --color "D73A4A" --description "Comportement incorrect à corriger" --force

echo "Terminé. Vérifiez sur github.com/<votre-compte>/safewayroad-frontend/labels"
