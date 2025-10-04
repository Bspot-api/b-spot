# B-Spot Database Seeders

Fichiers SQL pour peupler la base de données B-Spot avec les écosystèmes d'influence français (Stérin/Otium Capital, Bolloré, Arnault).

## Structure

Les seeders sont organisés par domaine sémantique et s'exécutent dans l'ordre de dépendance :

```
seeders/
├── 00-master.sql              # Orchestrateur principal (exécute tout dans l'ordre)
├── 01-sectors.sql             # Secteurs d'activité
├── 02-funds.sql               # Fonds d'investissement et holdings
├── 03-personalities.sql       # Personnalités (entrepreneurs, médias, familles)
├── 04-companies.sql           # Entreprises du portefeuille
├── 05-brands.sql              # Marques (LVMH, médias Bolloré)
├── 06-entity-relations.sql    # Relations entre entités (investissements, secteurs, funding)
└── 07-personality-relations.sql # Relations personnalités (famille, rivalités)
```

## Utilisation

### Exécution complète (recommandé)

```bash
# Depuis la racine du projet
PGPASSWORD="your-password" psql \
  -h <host> \
  -p <port> \
  -U <user> \
  -d <database> \
  -f seeders/00-master.sql
```

### Exécution d'un fichier spécifique

```bash
# Exemple : charger uniquement les secteurs
PGPASSWORD="your-password" psql \
  -h <host> \
  -p <port> \
  -U <user> \
  -d <database> \
  -f seeders/01-sectors.sql
```

### Variables d'environnement production

```bash
# Valeurs de production (depuis CLAUDE.md)
export DATABASE_HOST=51.159.10.199
export DATABASE_PORT=18359
export DATABASE_USER=bspot
export DATABASE_NAME=rdb
export DATABASE_PASSWORD="vowed-proofing-coasTal7-canyon"

# Exécution
PGPASSWORD="$DATABASE_PASSWORD" psql \
  -h $DATABASE_HOST \
  -p $DATABASE_PORT \
  -U $DATABASE_USER \
  -d $DATABASE_NAME \
  -f seeders/00-master.sql
```

## Contenu des seeders

### 01-sectors.sql
- **Secteurs génériques** : Technologie, Santé, Loisirs, Hôtellerie, Industrie & Énergie, Immobilier
- **Secteurs Bolloré** : Holdings, Télévision, Radio, Publicité, Cinéma, Presse, Gaming, Streaming
- **Secteurs Arnault** : Luxury & Fashion, Media & Communication

### 02-funds.sql
- **Otium Capital** : Family office de Pierre-Édouard Stérin (AUM 1.7 Md€)
- **Groupe Bolloré** : Conglomérat familial + Vivendi (médias)
- **Groupe Arnault** : Holding Agache (contrôle LVMH via Christian Dior SE)
- **Co-investisseurs** : Bpifrance, Isai, BioDiscovery 5 LP

### 03-personalities.sql
- **Écosystème Stérin** : Pierre-Édouard Stérin, François Durvye
- **Famille Bolloré** : Vincent, Cyrille, Marie, Sébastien, Yannick + figures médias (Hanouna, Praud, Lejeune)
- **Famille Arnault** : Bernard, Delphine, Antoine, Alexandre, Frédéric, Jean + Xavier Niel, François Pinault
- **Founders tech** : Igor Carron, Laurent Daudet (LightOn), Thomas Clozel (Owkin), Firmin Zocchetto (PayFit)

### 04-companies.sql (358 lignes)
- **Portfolio Otium** : Hyppo, LightOn, Owkin, PayFit, Shippeo, VSORA, Amenitiz, Stage11, Prello, Aria, Metomic, Rzilient
- **Plateformes roll-up Otium Partners** : Comet Software, Otelium, Alfeor, Enosium Life Science, Novavet, Hadrena
- **Otium Studio** : Startup studio (>180 M€ d'ici 2030)
- **Entreprises Bolloré** : Canal+, CNews, C8, Europe 1, Havas, Prisma Media, Gameloft, Dailymotion
- **Entreprises Arnault** : LVMH, Christian Dior SE, Les Échos, Le Parisien
- **Co-investisseurs** : Omnes Capital, Adélie Capital, EIC Fund, Partech, Cathay Innovation, GV, Bristol Myers Squibb, Sanofi

### 05-brands.sql
- **Marques LVMH** : Louis Vuitton, Christian Dior, Givenchy, Fendi, Moët & Chandon, Hennessy, TAG Heuer, Tiffany & Co., Rimowa, Loro Piana, Berluti, Celine
- **Chaînes Canal+** : Canal+ Sport, Canal+ Cinéma, Canal+ Séries, Canal+ Docs, Canal+ Kids

### 06-entity-relations.sql (398 lignes)
- **Relations d'investissement** : Otium → portfolio (invested_in), co-investisseurs → startups
- **Relations sectorielles** : Companies → secteurs (operates_in, belongs_to)
- **Plateformes** : Otium → plateformes roll-up (plateforme_roll-up)
- **Studio** : Otium Studio → startups incubées (incubée_par)
- **Financement** : Rounds détaillés avec dates/montants/leads (financement)
  - **VSORA** : $46M (04/2025)
  - **Amenitiz** : seed €620k (2019) → seed €6.5M (2021) → Series A $30M (2022)
  - **PayFit** : €5M (2016) → €14M (2017) → Series C €70M (2019) → Series D €90M (2021) → Series E €254M (2022, unicorn)
  - **Shippeo** : seed €2M (2016) → Series A €10M (2017) → €20M (2020) → $32M (2021) → $40M (2022) → $30M stratégique Toyota (2025)
- **Ownership** : Groupe Arnault → LVMH, Vivendi → Canal+/Havas, Groupe Bolloré → Vivendi
- **Management** : Famille Arnault → marques LVMH, Yannick Bolloré → Havas

### 07-personality-relations.sql (300 lignes)
- **Relations familiales** : Arnault (Bernard ↔ 5 enfants), Bolloré (Vincent ↔ Cyrille, Marie, Sébastien)
- **Partenariats** : Xavier Niel ↔ Delphine Arnault (couple depuis 2010)
- **Rivalités** : Bernard Arnault ↔ François Pinault (bataille du luxe)
- **Alliances politiques** : Pierre-Édouard Stérin ↔ Vincent Bolloré

## Pattern UPSERT

Tous les seeders utilisent `INSERT ... ON CONFLICT ... DO UPDATE` pour permettre :
- **Idempotence** : exécution multiple sans erreur
- **Mise à jour** : refresh des descriptions/données sans recréer

```sql
INSERT INTO sectors (name, description, published, "createdAt") VALUES
('Technologie & Digital', 'Secteur des technologies...', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  published = EXCLUDED.published;
```

## Statistiques

- **Secteurs** : 21
- **Fonds** : 7
- **Personnalités** : 32
- **Entreprises** : ~150
- **Marques** : ~20
- **Entity Relations** : ~250 (investissements, secteurs, funding rounds, ownership)
- **Personality Relations** : ~30 (famille, rivalités, partenariats)

## Notes importantes

- Les relations `entity_relations` utilisent les nouveaux types ajoutés à l'enum `RelationType` :
  - `invested_in`, `belongs_to`, `financement`, `plateforme_roll-up`, `studio`, `incubée_par`, `is_connected_to`
- Les montants de financement sont documentés dans les `notes` avec dates, leads et co-investisseurs
- Les sources sont vérifiées (PRs officielles, TechCrunch, sites web entreprises)
- Instagram-only sources ont été remplacées par des sources officielles lors du nettoyage des données

## Maintenance

Pour ajouter de nouvelles données :
1. Éditer le fichier seeder approprié (ex: `04-companies.sql` pour une nouvelle entreprise)
2. Respecter le pattern UPSERT avec `ON CONFLICT`
3. Vérifier les dépendances (ex: secteur doit exister avant company→sector relation)
4. Tester avec `00-master.sql` pour valider l'ordre d'exécution

## Migration depuis all-seeders.sql

L'ancien fichier monolithique `all-seeders.sql` (1179 lignes) a été décomposé en 7 fichiers sémantiques pour :
- **Maintenabilité** : modifications ciblées par domaine
- **Lisibilité** : fichiers plus courts et focalisés
- **Flexibilité** : charger uniquement certaines parties si besoin
- **Documentation** : structure claire et autodocumentée
