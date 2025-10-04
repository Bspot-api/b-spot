-- =====================================================
-- MASTER SEEDER - B-SPOT DATABASE
-- =====================================================
-- Orchestrates all seeder files in correct dependency order
-- Run this file to populate the entire database
--
-- Usage:
--   psql -h <host> -p <port> -U <user> -d <database> -f seeders/00-master.sql
--
-- Or with environment variables:
--   PGPASSWORD="your-password" psql -h <host> -p <port> -U <user> -d <database> -f seeders/00-master.sql
--
-- Files are executed in dependency order:
--   1. Sectors (independent)
--   2. Funds (independent)
--   3. Personalities (independent)
--   4. Companies (depends on sectors via relations)
--   5. Brands (independent)
--   6. Entity Relations (depends on all entities)
--   7. Personality Relations (depends on personalities)
-- =====================================================

\echo ''
\echo '======================================================='
\echo 'B-SPOT DATABASE SEEDER'
\echo '======================================================='
\echo ''

-- 1. SECTORS
\echo 'Loading sectors...'
\i seeders/01-sectors.sql
\echo '✓ Sectors loaded'
\echo ''

-- 2. FUNDS
\echo 'Loading funds...'
\i seeders/02-funds.sql
\echo '✓ Funds loaded'
\echo ''

-- 3. PERSONALITIES
\echo 'Loading personalities...'
\i seeders/03-personalities.sql
\echo '✓ Personalities loaded'
\echo ''

-- 4. COMPANIES
\echo 'Loading companies...'
\i seeders/04-companies.sql
\echo '✓ Companies loaded'
\echo ''

-- 5. BRANDS
\echo 'Loading brands...'
\i seeders/05-brands.sql
\echo '✓ Brands loaded'
\echo ''

-- 6. ENTITY RELATIONS
\echo 'Loading entity relations...'
\i seeders/06-entity-relations.sql
\echo '✓ Entity relations loaded'
\echo ''

-- 7. PERSONALITY RELATIONS
\echo 'Loading personality relations...'
\i seeders/07-personality-relations.sql
\echo '✓ Personality relations loaded'
\echo ''

\echo ''
\echo '======================================================='
\echo 'DATABASE SEEDING COMPLETED SUCCESSFULLY'
\echo '======================================================='
\echo ''
\echo 'Summary:'
\echo '  - Sectors: French business sectors'
\echo '  - Funds: Otium Capital, Vivendi, Groupe Bolloré, Groupe Arnault + co-investors'
\echo '  - Personalities: Stérin, Bolloré, Arnault families + key figures'
\echo '  - Companies: Portfolio companies, media entities, luxury brands'
\echo '  - Brands: LVMH brands, Canal+ channels, media outlets'
\echo '  - Entity Relations: Investments, ownership, sector mappings, funding rounds'
\echo '  - Personality Relations: Family ties, rivalries, partnerships'
\echo ''
