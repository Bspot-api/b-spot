#!/bin/bash

# Script pour créer des PR sur les repos publics

set -e

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier qu'on est sur une branche supportée
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "develop" ]]; then
    echo -e "${RED}❌ Erreur: Seules les branches 'main' et 'develop' sont supportées pour la synchronisation.${NC}"
    echo "   Branche courante: $CURRENT_BRANCH"
    exit 1
fi

echo -e "${BLUE}🚀 Création de PR pour synchroniser vers les repos publics${NC}"
echo -e "${YELLOW}📋 Branche source: $CURRENT_BRANCH${NC}"
echo ""

# Interface interactive pour les informations de la PR
echo -e "${BLUE}ℹ️  Informations pour la PR:${NC}"
echo ""

# Nom de la branche
read -p "🌿 Nom de la branche sur les repos publics (ex: feature/auth-improvements): " PR_BRANCH
if [[ -z "$PR_BRANCH" ]]; then
    echo -e "${RED}❌ Le nom de la branche est obligatoire${NC}"
    exit 1
fi

# Titre de la PR
read -p "📝 Titre de la PR: " PR_TITLE
if [[ -z "$PR_TITLE" ]]; then
    echo -e "${RED}❌ Le titre de la PR est obligatoire${NC}"
    exit 1
fi

# Description de la PR (optionnelle)
echo "📄 Description de la PR (optionnelle, appuyez sur Entrée pour finir):"
DESCRIPTION=""
while IFS= read -r line; do
    if [[ -z "$line" ]]; then
        break
    fi
    DESCRIPTION+="$line"$'\n'
done

# Branche de base (par défaut la même que la source)
echo ""
echo -e "${YELLOW}🎯 Branche de base sur les repos publics (défaut: $CURRENT_BRANCH):${NC}"
read -p "   " BASE_BRANCH
BASE_BRANCH=${BASE_BRANCH:-$CURRENT_BRANCH}

echo ""
echo -e "${BLUE}📋 Résumé:${NC}"
echo "   Branche source: $CURRENT_BRANCH"
echo "   Nouvelle branche: $PR_BRANCH"
echo "   Branche de base: $BASE_BRANCH"
echo "   Titre: $PR_TITLE"
if [[ -n "$DESCRIPTION" ]]; then
    echo "   Description: $(echo "$DESCRIPTION" | head -n 1)..."
fi
echo ""

read -p "Continuer ? (y/N): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo -e "${YELLOW}❌ Annulé${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}🚀 Création des PR...${NC}"

# Créer la branche et pousser l'API
echo -e "${BLUE}📡 Création de la PR pour l'API...${NC}"
if git subtree push --prefix=api api-public "$PR_BRANCH" 2>/dev/null; then
    # Créer la PR pour l'API
    gh pr create \
        --repo Bspot-api/b-spot-api \
        --head "$PR_BRANCH" \
        --base "$BASE_BRANCH" \
        --title "$PR_TITLE" \
        --body "$DESCRIPTION" || echo -e "${YELLOW}⚠️  PR API: erreur ou PR déjà existante${NC}"
    
    API_PR_URL=$(gh pr view --repo Bspot-api/b-spot-api "$PR_BRANCH" --json url -q .url 2>/dev/null || echo "")
    if [[ -n "$API_PR_URL" ]]; then
        echo -e "${GREEN}✅ PR API créée: $API_PR_URL${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Impossible de pousser l'API (branche existe peut-être déjà)${NC}"
fi

echo ""

# Créer la branche et pousser le frontend
echo -e "${BLUE}🎨 Création de la PR pour le frontend...${NC}"
if git subtree push --prefix=frontend frontend-public "$PR_BRANCH" 2>/dev/null; then
    # Créer la PR pour le frontend
    gh pr create \
        --repo Bspot-api/b-spot-frontend \
        --head "$PR_BRANCH" \
        --base "$BASE_BRANCH" \
        --title "$PR_TITLE" \
        --body "$DESCRIPTION" || echo -e "${YELLOW}⚠️  PR Frontend: erreur ou PR déjà existante${NC}"
    
    FRONTEND_PR_URL=$(gh pr view --repo Bspot-api/b-spot-frontend "$PR_BRANCH" --json url -q .url 2>/dev/null || echo "")
    if [[ -n "$FRONTEND_PR_URL" ]]; then
        echo -e "${GREEN}✅ PR Frontend créée: $FRONTEND_PR_URL${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Impossible de pousser le frontend (branche existe peut-être déjà)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Synchronisation par PR terminée !${NC}"

# Afficher les liens des PR si disponibles
if [[ -n "$API_PR_URL" || -n "$FRONTEND_PR_URL" ]]; then
    echo ""
    echo -e "${BLUE}🔗 Liens des PR créées:${NC}"
    [[ -n "$API_PR_URL" ]] && echo "   API: $API_PR_URL"
    [[ -n "$FRONTEND_PR_URL" ]] && echo "   Frontend: $FRONTEND_PR_URL"
fi