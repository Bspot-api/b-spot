#!/bin/bash

# B-Spot Repository Status Checker
# Quick overview of all repository statuses

echo "🔍 B-Spot Repository Status Overview"
echo "====================================="
echo ""

# Check private repository
echo "📁 Private Repository (b-spot-private):"
if [ -d ".git" ]; then
    echo "  ✅ Git repository found"
    echo "  🌿 Branch: $(git branch --show-current)"
    echo "  📍 Remote: $(git remote get-url origin)"
    echo "  📝 Last commit: $(git log -1 --format='%h - %s (%cr)')"
    echo "  🔄 Status: $(git status --porcelain | wc -l | tr -d ' ') files modified"
else
    echo "  ❌ Not a git repository"
fi

echo ""

# Check API public repository
echo "📁 API Public Repository (b-spot-api-public):"
if [ -d "../b-spot-api-public/.git" ]; then
    cd "../b-spot-api-public"
    echo "  ✅ Git repository found"
    echo "  🌿 Branch: $(git branch --show-current)"
    echo "  📍 Remote: $(git remote get-url origin)"
    echo "  📝 Last commit: $(git log -1 --format='%h - %s (%cr)')"
    echo "  🔄 Status: $(git status --porcelain | wc -l | tr -d ' ') files modified"
    cd - > /dev/null
else
    echo "  ❌ Not found or not a git repository"
fi

echo ""

# Check Frontend public repository
echo "📁 Frontend Public Repository (b-spot-frontend-public):"
if [ -d "../b-spot-frontend-public/.git" ]; then
    cd "../b-spot-frontend-public"
    echo "  ✅ Git repository found"
    echo "  🌿 Branch: $(git branch --show-current)"
    echo "  📍 Remote: $(git remote get-url origin)"
    echo "  📝 Last commit: $(git log -1 --format='%h - %s (%cr)')"
    echo "  🔄 Status: $(git status --porcelain | wc -l | tr -d ' ') files modified"
    cd - > /dev/null
else
    echo "  ❌ Not found or not a git repository"
fi

echo ""
echo "====================================="
echo "💡 Use './scripts/maintain-public-repos.sh' for maintenance"
echo "💡 Use '~/switch-to-bspot.sh' to switch to B-Spot identity"
echo "💡 Use '~/switch-to-tatiana.sh' to switch to personal identity"
