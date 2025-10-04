-- 9. PERSONALITY RELATIONS CREATION
-- =====================================================

-- Arnault family relations
INSERT INTO personality_relations (source_personality_id, target_personality_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Bernard Arnault and his children
((SELECT id FROM personalities WHERE name = 'Bernard Arnault'), (SELECT id FROM personalities WHERE name = 'Delphine Arnault'), 'is_family_of', 'Père et fille (Delphine est la fille aînée de Bernard Arnault)', NOW(), NOW()),
((SELECT id FROM personalities WHERE name = 'Bernard Arnault'), (SELECT id FROM personalities WHERE name = 'Antoine Arnault'), 'is_family_of', 'Père et fils (Antoine Arnault)', NOW(), NOW()),
((SELECT id FROM personalities WHERE name = 'Bernard Arnault'), (SELECT id FROM personalities WHERE name = 'Alexandre Arnault'), 'is_family_of', 'Père et fils (Alexandre Arnault)', NOW(), NOW()),
((SELECT id FROM personalities WHERE name = 'Bernard Arnault'), (SELECT id FROM personalities WHERE name = 'Frédéric Arnault'), 'is_family_of', 'Père et fils (Frédéric Arnault)', NOW(), NOW()),
((SELECT id FROM personalities WHERE name = 'Bernard Arnault'), (SELECT id FROM personalities WHERE name = 'Jean Arnault'), 'is_family_of', 'Père et fils (Jean Arnault)', NOW(), NOW()),

-- Xavier Niel is Bernard Arnault's son-in-law
((SELECT id FROM personalities WHERE name = 'Bernard Arnault'), (SELECT id FROM personalities WHERE name = 'Xavier Niel'), 'is_connected_to', 'Partenaire de sa fille Delphine Arnault depuis 2010', NOW(), NOW()),

-- Rivalry between Bernard Arnault and François Pinault
((SELECT id FROM personalities WHERE name = 'Bernard Arnault'), (SELECT id FROM personalities WHERE name = 'François Pinault'), 'is_rival_of', 'Rival de longue date dans le secteur du luxe (LVMH vs Kering, bataille Gucci)', NOW(), NOW()),

-- Nouvelles relations interpersonnelles découvertes
-- Xavier Niel et Delphine Arnault couple
((SELECT id FROM personalities WHERE name = 'Xavier Niel'), (SELECT id FROM personalities WHERE name = 'Delphine Arnault'), 'is_partner_of', 'Partenaires (couple) depuis 2010 ; 2 enfants en commun (sources publiques).', NOW(), NOW()),

-- Relations politiques Stérin-Bolloré
((SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'is_colleague_of', 'Alliance politique et médiatique pour influence droite conservatrice française', NOW(), NOW()),

-- Nouvelles relations familiales Bolloré (investigation ChatGPT)
-- Vincent Bolloré et ses enfants
((SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), (SELECT id FROM personalities WHERE name = 'Cyrille Bolloré'), 'is_family_of', 'Père et fils (Cyrille est le fils cadet et successeur de Vincent Bolloré)', NOW(), NOW()),
((SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), (SELECT id FROM personalities WHERE name = 'Marie Bolloré'), 'is_family_of', 'Père et fille (Marie Bolloré dirige la division Electromobilité)', NOW(), NOW()),
((SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), (SELECT id FROM personalities WHERE name = 'Sébastien Bolloré'), 'is_family_of', 'Père et fils (Sébastien Bolloré, autre fils de Vincent)', NOW(), NOW())

ON CONFLICT (source_personality_id, target_personality_id, relation_type) DO NOTHING;

-- =====================================================
-- 10. OWKIN CO-INVESTORS RELATIONS
-- =====================================================

-- Owkin investment relations with co-investors
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- GV invested in Owkin
('company', (SELECT id FROM companies WHERE name = 'GV (Google Ventures)'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- Bpifrance invested in Owkin
('fund', (SELECT id FROM funds WHERE name = 'Bpifrance'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- F-Prime Capital invested in Owkin
('company', (SELECT id FROM companies WHERE name = 'F-Prime Capital'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- MACSF invested in Owkin
('company', (SELECT id FROM companies WHERE name = 'MACSF'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- Isai invested in Owkin
('fund', (SELECT id FROM funds WHERE name = 'Isai'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- BioDiscovery 5 LP invested in Owkin
('fund', (SELECT id FROM funds WHERE name = 'BioDiscovery 5 LP'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- Bristol Myers Squibb invested in Owkin
('company', (SELECT id FROM companies WHERE name = 'Bristol Myers Squibb'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', 'Investisseur stratégique et partenaire pharmaceutique d''Owkin', NOW(), NOW()),

-- Sanofi invested in Owkin
('company', (SELECT id FROM companies WHERE name = 'Sanofi'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', 'Investissement de 180 millions $ pour le partenariat stratégique en IA médicale', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 13. OTIUM CAPITAL → PLATEFORMES ROLL-UP
-- =====================================================

-- Otium Capital → plateformes (relation "plateforme_roll-up")
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Comet Software'), 'plateforme_roll-up', 'Plateforme business software portée par Otium Partners (livre blanc 12/2024).', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Otelium'), 'plateforme_roll-up', 'Plateforme hôtelière (roll-up).', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Alfeor'), 'plateforme_roll-up', 'Plateforme nucléaire (roll-up).', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Enosium Life Science'), 'plateforme_roll-up', 'Plateforme services scientifiques santé (roll-up).', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Novavet'), 'plateforme_roll-up', 'Plateforme santé animale (roll-up).', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Hadrena'), 'plateforme_roll-up', 'Plateforme loisirs locaux (FEC).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 14. OTIUM CAPITAL → OTIUM STUDIO
-- =====================================================

-- Otium Capital → Otium Studio (relation "studio")
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Otium Studio'), 'studio', 'Startup studio intégré (budget >180 M€ jusqu''en 2030).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Otium Studio → Hyppo (exemple de startup studio)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Otium Studio'), 'company', (SELECT id FROM companies WHERE name ILIKE 'Hyppo'), 'incubée_par', 'Hyppo lancée/accélérée via Otium Studio (PR 10/04/2024).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 15. OTIUM CAPITAL → PARTICIPATIONS INVESTMENT/VENTURE
-- =====================================================

-- Otium Capital → participations (relation "invested_in")
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'VSORA'), 'invested_in', 'Lead 46 M$ en 04/2025.', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Orcan Energy'), 'invested_in', 'Entrée au capital annoncée le 31/01/2023.', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'invested_in', 'Lead seed 2019 ; participation Série A 2022.', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Stage11'), 'invested_in', 'Seed 5 M€ menée par Otium (10/2021).', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Rzilient'), 'invested_in', 'Participation tour early (2021–2023).', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Metomic'), 'invested_in', 'Participation via Resonance (véhicule tech d''Otium).', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Prello'), 'invested_in', 'Seed 13 M€ menée par Otium (02/2022).', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Aria'), 'invested_in', 'Série A 12/2023 aux côtés d''Adevinta Ventures.', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'PayFit'), 'invested_in', 'Tour 2016 (co-mené avec Xavier Niel / NJJ) ; suivi 2019 via Frst.', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'invested_in', 'Seed 2016 ; Série A 2017 avec Partech.', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Otium Leisure'), 'invested_in', 'Financement 140 M€ (09/2024) pour construire un leader FEC.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 16. VSORA CO-INVESTORS RELATIONS
-- =====================================================

-- Co-investissement VSORA (tour 46 M$ 04/2025)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Omnes Capital'), 'company', (SELECT id FROM companies WHERE name = 'VSORA'), 'invested_in', 'Participation au tour 46 M$ (04/2025).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Adélie Capital'), 'company', (SELECT id FROM companies WHERE name = 'VSORA'), 'invested_in', 'Participation au tour 46 M$ (04/2025).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'EIC Fund'), 'company', (SELECT id FROM companies WHERE name = 'VSORA'), 'invested_in', 'Co-financement EIC Fund (04/2025).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 11. HEALTH SECTOR MAPPING
-- =====================================================

-- Map health/biotech companies to "Santé & Bien-être" sector
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Owkin → Health sector
('company', (SELECT id FROM companies WHERE name = 'Owkin'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'belongs_to', 'Licorne française IA + santé, valorisée 2 milliards $ (2023)', NOW(), NOW()),

-- Quantum Genomics → Health sector
('company', (SELECT id FROM companies WHERE name = 'Quantum Genomics'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'belongs_to', 'Biotech cardiovasculaire française (échec/faillite 2023)', NOW(), NOW()),

-- Nyxoah → Health sector
('company', (SELECT id FROM companies WHERE name = 'Nyxoah'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'belongs_to', 'Medtech belge apnée du sommeil, IPO Euronext Brussels (2020)', NOW(), NOW()),

-- Quinten Health → Health sector
('company', (SELECT id FROM companies WHERE name = 'Quinten Health'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'belongs_to', 'IA santé française, partenariat avec Aetion (Real-World Evidence)', NOW(), NOW()),

-- Bristol Myers Squibb → Health sector
('company', (SELECT id FROM companies WHERE name = 'Bristol Myers Squibb'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'belongs_to', 'Big Pharma américain, partenaire et investisseur Owkin', NOW(), NOW()),

-- Sanofi → Health sector
('company', (SELECT id FROM companies WHERE name = 'Sanofi'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'belongs_to', 'Géant pharmaceutique français, investisseur stratégique Owkin (180M$)', NOW(), NOW()),

-- Aetion → Health sector
('company', (SELECT id FROM companies WHERE name = 'Aetion'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'belongs_to', 'Plateforme Real-World Evidence américaine, partenaire Quinten Health', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 12. QUINTEN HEALTH ↔ AETION PARTNERSHIP
-- =====================================================

-- Quinten Health partnership with Aetion
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Quinten Health'), 'company', (SELECT id FROM companies WHERE name = 'Aetion'), 'partners_with', 'Partenariat Real-World Evidence : Quinten Health (France) × Aetion (USA)', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 17. OTIUM PORTFOLIO - SECTOR MAPPING
-- =====================================================

-- Technologie & Digital
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'VSORA'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'Semi-conducteurs IA (inference chips).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'PayFit'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'SaaS paie/RH.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'Plateforme visibilité transport.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'SaaS hôtellerie (PMS, CM, Booking).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Stage11'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'Expériences immersives/métaverse.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Metomic'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'Data Security / DLP SaaS & GenAI.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Rzilient'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'IT Asset/MDM & support.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Comet Software'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'Plateforme roll-up éditeurs logiciels.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Aria'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'Infra paiement différé B2B (fintech).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Santé & Bien-être
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Enosium Life Science'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'operates_in', 'Services scientifiques (CRO/RA/MA).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Novavet'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'operates_in', 'Santé animale (cliniques & services).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Loisirs
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Otium Leisure'), 'sector', (SELECT id FROM sectors WHERE name = 'Loisirs'), 'operates_in', 'FEC/multi-activités indoor.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Hadrena'), 'sector', (SELECT id FROM sectors WHERE name = 'Loisirs'), 'operates_in', 'Plateforme loisirs (SpeedPark, Koezio…).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Hôtellerie
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Otelium'), 'sector', (SELECT id FROM sectors WHERE name = 'Hôtellerie'), 'operates_in', 'Investissement & exploitation hôtelière.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'sector', (SELECT id FROM sectors WHERE name = 'Hôtellerie'), 'operates_in', 'Logiciels pour hôteliers.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Industrie & Énergie
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Alfeor'), 'sector', (SELECT id FROM sectors WHERE name = 'Industrie & Énergie'), 'operates_in', 'Équipementier filière nucléaire (build-up).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Orcan Energy'), 'sector', (SELECT id FROM sectors WHERE name = 'Industrie & Énergie'), 'operates_in', 'ORC – valorisation chaleur fatale.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Immobilier (Prello proptech)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Prello'), 'sector', (SELECT id FROM sectors WHERE name = 'Immobilier'), 'operates_in', 'Proptech co-achat résidences secondaires.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 18. OTIUM PORTFOLIO - FUNDING ROUNDS
-- =====================================================

-- VSORA - 29/04/2025: $46M, lead Otium
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'VSORA'), 'company', (SELECT id FROM companies WHERE name = 'VSORA'), 'financement', '29/04/2025 : $46M — lead Otium (+ family office FR) ; co-investisseurs Omnes, Adélie, co-financement EIC Fund.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Amenitiz - funding rounds (détaillés)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'financement', '16/09/2019 : Seed €620k — lead Otium Capital ; business angels (S. Venturini – Weekendesk, A. Giraud – Groupcorner, G. Rostand – Liligo).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'financement', '10/11/2021 : Seed €6.5m — lead Point Nine ; participants : Backed, Otium, business angels.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'financement', '05/04/2022 : Series A $30m — lead Eight Roads ; Chalfen Ventures + Point Nine, Backed, Otium (existing).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Stage11 - 13/10/2021: seed €5M
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Stage11'), 'company', (SELECT id FROM companies WHERE name = 'Stage11'), 'financement', '13/10/2021 : seed €5M — mené par Otium.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Prello - 07/02/2022: seed €13M
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Prello'), 'company', (SELECT id FROM companies WHERE name = 'Prello'), 'financement', '07/02/2022 : seed €13M — lead Otium ; Axeleo en suivi.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Aria - 12/12/2023: Série A €14M
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Aria'), 'company', (SELECT id FROM companies WHERE name = 'Aria'), 'financement', '12/12/2023 : Série A €14m — lead 13books ; avec Adevinta Ventures, Ankaa, Otium + business angels.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Metomic - 22/02/2023: Series A $20M
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Metomic'), 'company', (SELECT id FROM companies WHERE name = 'Metomic'), 'financement', '22/02/2023 : Series A $20M — Evolution Equity Partners lead ; Resonance (Otium) & Connect Ventures.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Rzilient - funding rounds
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Rzilient'), 'company', (SELECT id FROM companies WHERE name = 'Rzilient'), 'financement', '07/02/2023 : tour ~€2.5M — investisseurs Otium & Tomcat (sources secondaires).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Rzilient'), 'company', (SELECT id FROM companies WHERE name = 'Rzilient'), 'financement', 'seed €1.3M — lead Otium (annonce Otium/LinkedIn).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Otium Leisure - 12/09/2024: €140M unitranche
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Otium Leisure'), 'company', (SELECT id FROM companies WHERE name = 'Otium Leisure'), 'financement', '12/09/2024 : financement €140m (unitranche) structuré par Eurazeo Dette Privée.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- PayFit - funding rounds
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'PayFit'), 'company', (SELECT id FROM companies WHERE name = 'PayFit'), 'financement', '11/10/2016 : €5m — Otium Venture & Xavier Niel (co-lead).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'PayFit'), 'company', (SELECT id FROM companies WHERE name = 'PayFit'), 'financement', '06/07/2017 : €14m — Accel lead ; participation Otium Venture & Xavier Niel.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'PayFit'), 'company', (SELECT id FROM companies WHERE name = 'PayFit'), 'financement', '17/06/2019 : Series C €70m — leads Eurazeo Growth & Bpifrance Large Venture ; participation Accel, Frst, Xavier Niel.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'PayFit'), 'company', (SELECT id FROM companies WHERE name = 'PayFit'), 'financement', '17/03/2021 : Series D €90m (≈$107m) — leads Eurazeo Growth & Bpifrance Large Venture ; participation Accel, Frst, Xavier Niel.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'PayFit'), 'company', (SELECT id FROM companies WHERE name = 'PayFit'), 'financement', '06/01/2022 : Series E €254m — lead General Atlantic ; participation Eurazeo, Bpifrance, Accel ; valo ~€1.82bn (unicorn).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Shippeo - funding rounds
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'financement', '2016 : seed €2m — Otium Venture lead.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'financement', '16/11/2017 : Série A €10m — Partech lead + Otium Venture.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'financement', '11/02/2020 : €20m — développement de la plateforme RTTV, clients >50 ; 40 pays.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'financement', '14/01/2021 : $32m — co-lead Battery Ventures + NGP Capital, ETF Partners, Partech, Bpifrance Digital Venture (existing).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'financement', '24/10/2022 : $40m — accélération internationale ; total levé > $110m.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'financement', '15/01/2025 : $30m (stratégique) — lead Woven Capital (Toyota) ; Battery, Partech, NGP Capital, Bpifrance DV, LFX, Shift4Good, Yamaha MV.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Orcan Energy - 31/01/2023: entry
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'Orcan Energy'), 'company', (SELECT id FROM companies WHERE name = 'Orcan Energy'), 'financement', '31/01/2023 : Otium Capital entre au capital (montant non communiqué).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;
