#!/bin/bash

# Script pour récupérer les changements depuis les repos publics

set -e

# Vérifier qu'on est sur une branche supportée
CURRENT_BRANCH=$(git branch --show-current)
BRANCH=${1:-$CURRENT_BRANCH}

if [[ "$BRANCH" != "main" && "$BRANCH" != "develop" ]]; then
    echo "❌ Erreur: Seules les branches 'main' et 'develop' sont supportées pour la synchronisation."
    echo "   Branche courante: $CURRENT_BRANCH"
    echo "   Usage: $0 [main|develop]"
    exit 1
fi

echo "📥 Récupération des changements de la branche '$BRANCH' depuis les repos publics..."

# Vérifier qu'on est sur la bonne branche
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
    echo "📋 Changement vers la branche $BRANCH..."
    git checkout "$BRANCH"
fi

# Récupérer les changements du repo API public
echo "📡 Pulling API changes from public repository (branch: $BRANCH)..."
git subtree pull --prefix=api api-public "$BRANCH" --squash

echo "🎨 Pulling frontend changes from public repository (branch: $BRANCH)..."
# Récupérer les changements du repo frontend public
git subtree pull --prefix=frontend frontend-public "$BRANCH" --squash

echo "✅ Synchronisation de la branche '$BRANCH' terminée !"