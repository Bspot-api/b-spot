# Branch Protection Rules Setup

Pour que les workflows de sync bloquent le merge en cas d'échec, vous devez configurer les **Branch Protection Rules** sur GitHub.

## 🔒 **Configuration requise :**

### **1. Aller dans Settings > Branches**
- Repository → Settings → Branches
- Cliquer sur "Add rule" ou modifier la règle existante

### **2. Configurer la protection pour `develop` et `main`**
```
Branch name pattern: develop, main
✓ Require a pull request before merging
✓ Require status checks to pass before merging
```

### **3. Ajouter les status checks requis**
Dans "Status checks that are required":
- `sync-api` (pour les PR vers develop/main)
- `sync-frontend` (pour les PR vers develop/main)

### **4. Autres options recommandées**
```
✓ Require branches to be up to date before merging
✓ Require conversation resolution before merging
✓ Include administrators
```

## 🚀 **Résultat :**
- ✅ **Merge bloqué** si la sync échoue
- ✅ **Sync automatique** avant le merge
- ✅ **Sécurité** : code vérifié avant intégration
- ✅ **Contrôle** : merge uniquement après validation

## 📋 **Workflows concernés :**
- `sync-api.yml` → Status check `sync-api`
- `sync-frontend.yml` → Status check `sync-frontend`
- `sync-all.yml` → Lance les deux en parallèle

## ⚠️ **Important :**
Les workflows se déclenchent maintenant sur `pull_request_target` avec des types spécifiques :
- `opened` : Nouvelle PR
- `synchronize` : Nouveaux commits
- `reopened` : PR réouverte
- `ready_for_review` : PR prête pour review

Le merge ne sera possible que si **tous** les status checks passent ! 🎯
