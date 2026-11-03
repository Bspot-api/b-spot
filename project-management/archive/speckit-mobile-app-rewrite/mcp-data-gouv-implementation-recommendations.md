# Recommandations d'implémentation - MCP data.gouv pour B-Spot

**Date**: 2026-03-05  
**Projet**: B-Spot (`apps/api` + `apps/mobile`)  
**Statut**: Proposition d'architecture et plan d'execution

## 1) Contexte et objectif

B-Spot dispose deja d'un pipeline runtime robuste:

- scan produit -> Open Food Facts
- resolution marque -> SIREN (seed + fuzzy + auto-discovery)
- enrichissement entreprise -> Pappers (cache/quota)

L'objectif n'est pas de remplacer ce pipeline, mais d'utiliser MCP data.gouv pour accelerer la curation des mappings `marque -> SIREN` dans les cas ambigus.

## 2) Decision recommandee

Ne pas introduire MCP data.gouv dans le chemin critique mobile/API de production.

- Garder les appels directs actuels pour le runtime (determinisme, latence, resilience).
- Utiliser MCP data.gouv pour un workflow "assistant/back-office" de validation et enrichissement.
- Prevoir un fallback total sans MCP (aucune regression produit si MCP indisponible).

## 3) Cas d'usage cibles (priorises)

1. Enrichir automatiquement les `brand_suggestions` avec candidats SIREN et score de confiance.
2. Aider la revue humaine (admin) pour accepter/rejeter une suggestion plus vite.
3. Produire des seeds qualifiees pour `brand-data.ts` a partir des suggestions validees.

## 4) Architecture cible (MVP)

### 4.1 Composants

- **API Nest existante**: conserve le runtime actuel.
- **Service d'enrichissement asynchrone** (nouveau): traite les `brand_suggestions` en attente.
- **Client MCP** (nouveau, interne): interroge MCP data.gouv (ou instance self-host).
- **Revue admin** (nouvelle route API, UI optionnelle): affiche candidats et decision.

### 4.2 Flux

1. Une suggestion est creee (`status=NEW`) via scan.
2. Un worker recupere la suggestion et appelle MCP data.gouv.
3. Le worker enregistre les meilleurs candidats (SIREN, nom legal, score, source).
4. Un reviewer valide:
   - **accepter** -> creation/maj de `Brand` avec `matchSource=MANUAL_REVIEW`
   - **rejeter** -> suggestion conservee, statut "rejected"
5. Option: export periodique des mappings valides vers seed.

## 5) Changements techniques recommandes

### 5.1 Base de donnees

Ajouter une table dediee aux enrichissements:

- `brand_suggestion_enrichment`
  - `id`
  - `brand_suggestion_id` (FK)
  - `provider` (`datagouv_mcp`)
  - `query`
  - `candidates_json` (liste ordonnee)
  - `top_siren`
  - `top_confidence`
  - `status` (`pending_review`, `accepted`, `rejected`, `error`)
  - `error_message`
  - `created_at`, `updated_at`

Raison: ne pas polluer l'entite `BrandSuggestion` et conserver un historique d'analyses.

### 5.2 API backend

Ajouter des endpoints admin:

- `GET /api/admin/brand-suggestions?status=NEW|ENRICHED`
- `GET /api/admin/brand-suggestions/:id/enrichment`
- `POST /api/admin/brand-suggestions/:id/accept` (payload: `siren`, `brandName?`)
- `POST /api/admin/brand-suggestions/:id/reject` (payload: `reason?`)
- `POST /api/admin/brand-suggestions/:id/re-enrich`

Conserver les endpoints publics actuels inchanges.

### 5.3 Worker / orchestration

Implementation simple en MVP:

- Cron Nest (`@nestjs/schedule`) toutes les X minutes.
- Batch de suggestions `NEW` sans enrichissement recent.
- Retrys limites + backoff.
- Timeout strict par appel externe.

Alternative phase 2: file de jobs (BullMQ) si charge plus elevee.

### 5.4 Client MCP

Creer un adaptateur unique:

- interface `BrandEnrichmentProvider` (methodes `searchBrandCandidates`, `healthcheck`)
- implementation `DataGouvMcpProvider`
- mapping vers un format interne stable (`CandidateMatch`)

Cette abstraction permet de basculer entre:

- MCP public
- instance self-host
- API directe `recherche-entreprises` (fallback)

## 6) Politique de fallback et fiabilite

Ordre recommande:

1. provider MCP self-host (si disponible)
2. provider MCP public
3. appel direct `recherche-entreprises.api.gouv.fr`

Regles:

- Si enrichissement indisponible -> suggestion reste traitable manuellement.
- Aucune erreur MCP ne doit bloquer le scan utilisateur.
- Logger les causes (`timeout`, `5xx`, parse) pour observabilite.

## 7) Securite et gouvernance

- Activer ce workflow uniquement sur endpoints admin proteges.
- Journaliser les decisions humaines (qui, quand, pourquoi).
- Versionner les regles de scoring pour audit.
- Ne jamais exposer de cle/secrets MCP au client mobile.

## 8) Plan d'implementation (4 phases)

### Phase A - Fondations (1-2 jours)

- Migration BDD `brand_suggestion_enrichment`
- Entite + repository + DTO
- Endpoints admin lecture

### Phase B - Enrichissement (2-3 jours)

- Interface provider + `DataGouvMcpProvider`
- Worker cron + retries/backoff
- Persistance candidats + statut

### Phase C - Revue/decision (1-2 jours)

- Endpoints accept/reject/re-enrich
- Creation/maj `Brand` depuis decision
- Tests unitaires et e2e sur flux complet

### Phase D - Stabilisation (1 jour)

- Metriques (taux enrichissement, taux acceptation, temps moyen de revue)
- Alerting simple en cas d'echecs en serie
- Documentation d'exploitation

## 9) Critères de succes

- >= 60% des suggestions recoivent au moins un candidat exploitable automatiquement.
- Diminution du temps moyen de traitement manuel d'une suggestion.
- 0 impact sur la latence du endpoint public `/api/scan`.
- 0 regression du flux scan en cas d'indisponibilite MCP.

## 10) Fichiers du repo concernes (cible)

- `apps/api/src/modules/brand-suggestion/*`
- `apps/api/src/modules/brand/*`
- `apps/api/src/modules/scan/*` (aucun changement de contrat public attendu)
- `apps/api/src/migrations/*`
- optionnel: ecran admin web (hors MVP mobile)

## 11) Recommandation finale

Implementer MCP data.gouv comme **accelerateur de curation**, pas comme dependance runtime produit.

Ce choix maximise la valeur (qualite des mappings, vitesse de revue) tout en preservant la robustesse du parcours utilisateur principal.
