-- 5. ENTITY RELATIONS CREATION
-- =====================================================

-- Main relations (Pierre-Edouard Stérin, Otium Capital, Pericles)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, start_date, notes, "createdAt", "updatedAt") VALUES
-- Pierre-Edouard Stérin founded Otium Capital
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'founded', '2009-01-01', 'Pierre-Edouard Sterin founded Otium Capital in 2009', NOW(), NOW()),

-- Otium Capital operates in political sector
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'sector', (SELECT id FROM sectors WHERE name = 'Politique et Think Tank'), 'operates_in', 'Otium Capital has investments in political/think tank sector', NOW(), NOW()),

-- Otium Capital owns Pericles
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'supports', 'Otium Capital/Stérin financent le projet Périclès (150M€ / 10 ans).', NOW(), NOW()),

-- Pierre-Edouard Stérin controls Périclès
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'founded', 'Commanditaire/porteur du projet Périclès ; financement annoncé 150 M€ / 10 ans.', NOW(), NOW()),

-- François Durvye relations avec Otium et Périclès
('personality', (SELECT id FROM personalities WHERE name = 'François Durvye'), 'fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'manages', 'Directeur général (CEO).', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'François Durvye'), 'company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'manages', 'Rôle opérationnel/soutien au dispositif (portraits & enquêtes).', NOW(), NOW()),

-- Périclès soutient Souveraine Tech
('company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'company', (SELECT id FROM companies WHERE name = 'Souveraine Tech'), 'supports', 'Lauréat/financé via écosystème "Maison du Bien commun" lié à Stérin.', NOW(), NOW()),

-- Relations d''investissement détaillées
-- Xavier Niel co-investit avec Otium sur PayFit
('personality', (SELECT id FROM personalities WHERE name = 'Xavier Niel'), 'company', (SELECT id FROM companies WHERE name = 'Payfit'), 'invests_in', 'Co-lead 5 M€ (2016) ; participation au tour B (2017).', NOW(), NOW()),

-- Co-investisseurs Shippeo
('company', (SELECT id FROM companies WHERE name = 'Partech'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'invests_in', 'Co-lead Série A 10 M€ (11/2017) avec Otium Venture.', NOW(), NOW()),

-- Co-investisseurs Owkin
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invests_in', 'Lead Série A (11 M$, 01/2018).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Cathay Innovation'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invests_in', 'Participation à la Série A 2018.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'GV (ex-Google Ventures)'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invests_in', 'Extension Série A (05/2018) avec GV.', NOW(), NOW()),

-- LightOn relation investisseur Otium
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'LightOn'), 'invests_in', 'Otium listé parmi les investisseurs (deeptech/photonic, puis GenAI).', NOW(), NOW()),

-- Périclès operates in political sector
('company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'sector', (SELECT id FROM sectors WHERE name = 'Politique et Think Tank'), 'operates_in', 'Initiative métapolitique annoncée à 150M€ sur 10 ans.', NOW(), NOW()),

-- Relations d''acquisition ajoutées du Lot 2
-- Katoo acquise par Choco
('company', (SELECT id FROM companies WHERE name = 'Katoo'), 'company', (SELECT id FROM companies WHERE name = 'Choco'), 'acquired', 'Katoo est désormais intégrée à Choco (2021–2022).', NOW(), NOW()),

-- Tekyn acquise par Lectra
('company', (SELECT id FROM companies WHERE name = 'Tekyn'), 'company', (SELECT id FROM companies WHERE name = 'Lectra'), 'acquired', 'Lectra a pris le contrôle (compléments 2022–2023).', NOW(), NOW()),

-- Relations ajoutées du Lot 2.2
-- Otium Capital investit dans Orcan Energy
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Orcan Energy'), 'invests_in', 'Entrée au capital annoncée le 31/01/2023.', NOW(), NOW()),

-- OXP opère dans le secteur Technologie & Digital
('company', (SELECT id FROM companies WHERE name = 'OXP'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'Extension SketchUp (UP) pour designers/architectes.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 6. COMPANY RELATIONS (Luxury & Fashion)
-- =====================================================

INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Adore Me relations
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Adore Me'), 'owns', 'Otium Capital owns Adore Me', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Adore Me'), 'manages', 'Pierre-Edouard Sterin manages Adore Me through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Adore Me'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', 'Adore Me operates in Luxury & Fashion sector', NOW(), NOW()),

-- Almé relations
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Almé'), 'owns', 'Otium Capital owns Almé', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Almé'), 'manages', 'Pierre-Edouard Sterin manages Almé through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Almé'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', 'Almé operates in Luxury & Fashion sector', NOW(), NOW()),

-- Ana Luisa relations
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Ana Luisa'), 'owns', 'Otium Capital owns Ana Luisa', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Ana Luisa'), 'manages', 'Pierre-Edouard Sterin manages Ana Luisa through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Ana Luisa'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', 'Ana Luisa operates in Luxury & Fashion sector', NOW(), NOW()),

-- Chnge relations
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Chnge'), 'owns', 'Otium Capital owns Chnge', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Chnge'), 'manages', 'Pierre-Edouard Sterin manages Chnge through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Chnge'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', 'Chnge operates in Luxury & Fashion sector', NOW(), NOW()),

-- Dialect relations
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Dialect'), 'owns', 'Otium Capital owns Dialect', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Dialect'), 'manages', 'Pierre-Edouard Sterin manages Dialect through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Dialect'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', 'Dialect operates in Luxury & Fashion sector', NOW(), NOW()),

-- Dossier relations
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Dossier'), 'owns', 'Otium Capital owns Dossier', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Dossier'), 'manages', 'Pierre-Edouard Sterin manages Dossier through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Dossier'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', 'Dossier operates in Luxury & Fashion sector', NOW(), NOW()),

-- Equivalenza relations
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Equivalenza'), 'owns', 'Otium Capital owns Equivalenza', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Equivalenza'), 'manages', 'Pierre-Edouard Sterin manages Equivalenza through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Equivalenza'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', 'Equivalenza operates in Luxury & Fashion sector', NOW(), NOW()),

-- Merci Handy relations
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Merci Handy'), 'owns', 'Otium Capital owns Merci Handy', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Merci Handy'), 'manages', 'Pierre-Edouard Sterin manages Merci Handy through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Merci Handy'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', 'Merci Handy operates in Luxury & Fashion sector', NOW(), NOW()),

-- Tekyn relations
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Tekyn'), 'owns', 'Otium Capital owns Tekyn', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Tekyn'), 'manages', 'Pierre-Edouard Sterin manages Tekyn through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Tekyn'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', 'Tekyn operates in Luxury & Fashion sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 7. COMPANY RELATIONS (Other Sectors)
-- =====================================================

-- Éducation & Formation relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Albert School'), 'owns', 'Otium Capital owns Albert School', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Albert School'), 'manages', 'Pierre-Edouard Sterin manages Albert School through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Albert School'), 'sector', (SELECT id FROM sectors WHERE name = 'Éducation & Formation'), 'operates_in', 'Albert School operates in Éducation & Formation sector', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Master Camp'), 'owns', 'Otium Capital owns Master Camp', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Master Camp'), 'manages', 'Pierre-Edouard Sterin manages Master Camp through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Master Camp'), 'sector', (SELECT id FROM sectors WHERE name = 'Éducation & Formation'), 'operates_in', 'Master Camp operates in Éducation & Formation sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Technologie & Digital relations (sample)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = '99digital'), 'owns', 'Otium Capital owns 99digital', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = '99digital'), 'manages', 'Pierre-Edouard Sterin manages 99digital through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = '99digital'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', '99digital operates in Technologie & Digital sector', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Payfit'), 'owns', 'Otium Capital owns Payfit', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Payfit'), 'manages', 'Pierre-Edouard Sterin manages Payfit through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Payfit'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'Payfit operates in Technologie & Digital sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Santé & Bien-être relations (sample)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Ananda'), 'owns', 'Otium Capital owns Ananda', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Ananda'), 'manages', 'Pierre-Edouard Sterin manages Ananda through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Ananda'), 'sector', (SELECT id FROM sectors WHERE name = 'Santé & Bien-être'), 'operates_in', 'Ananda operates in Santé & Bien-être sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Divertissement & Loisirs relations (sample)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Smartbox'), 'owns', 'Otium Capital owns Smartbox', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Smartbox'), 'manages', 'Pierre-Edouard Sterin manages Smartbox through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Smartbox'), 'sector', (SELECT id FROM sectors WHERE name = 'Divertissement & Loisirs'), 'operates_in', 'Smartbox operates in Divertissement & Loisirs sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Alimentation & Nutrition relations (sample)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'BeFC'), 'owns', 'Otium Capital owns BeFC', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'BeFC'), 'manages', 'Pierre-Edouard Sterin manages BeFC through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'BeFC'), 'sector', (SELECT id FROM sectors WHERE name = 'Technologie & Digital'), 'operates_in', 'Deeptech batteries bio-enzymatiques pour IoT/medtech.', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Automobile & Transport relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Vell'), 'owns', 'Otium Capital owns Vell (ex-Carsell)', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Vell'), 'manages', 'Pierre-Edouard Sterin manages Vell (ex-Carsell) through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Vell'), 'sector', (SELECT id FROM sectors WHERE name = 'Automobile & Transport'), 'operates_in', 'Vell (ex-Carsell) operates in Automobile & Transport sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 7. BOLLORÉ RELATIONS CREATION
-- =====================================================

-- Main Bolloré relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Vincent Bolloré controls Vivendi
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'controls', 'Vincent Bolloré controls Vivendi through shareholding', NOW(), NOW()),

-- Vincent Bolloré controls Groupe Bolloré
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'fund', (SELECT id FROM funds WHERE name = 'Groupe Bolloré'), 'controls', 'Vincent Bolloré controls Groupe Bolloré', NOW(), NOW()),

-- Vivendi operates in media sector
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'sector', (SELECT id FROM sectors WHERE name = 'Media & Communication'), 'operates_in', 'Vivendi operates in media and communication sector', NOW(), NOW()),

-- Groupe Bolloré operates in holding sector
('fund', (SELECT id FROM funds WHERE name = 'Groupe Bolloré'), 'sector', (SELECT id FROM sectors WHERE name = 'Holdings & Investissement'), 'operates_in', 'Groupe Bolloré operates as a holding company', NOW(), NOW()),

-- Groupe Bolloré owns Vivendi SE
('fund', (SELECT id FROM funds WHERE name = 'Groupe Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Vivendi SE'), 'owns', 'Groupe Bolloré owns Vivendi SE', NOW(), NOW()),

-- Vincent Bolloré controls Vivendi SE
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Vivendi SE'), 'controls', 'Vincent Bolloré controls Vivendi SE through Groupe Bolloré', NOW(), NOW()),

-- Vivendi SE operates in media sector
('company', (SELECT id FROM companies WHERE name = 'Vivendi SE'), 'sector', (SELECT id FROM sectors WHERE name = 'Media & Communication'), 'operates_in', 'Vivendi SE operates in media and communication sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Télévision & Audiovisuel relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Canal+ Group relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Canal+ Group'), 'owns', 'Vivendi owns Canal+ Group', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Maxime Saada'), 'company', (SELECT id FROM companies WHERE name = 'Canal+ Group'), 'manages', 'Maxime Saada manages Canal+ Group through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Canal+ Group'), 'sector', (SELECT id FROM sectors WHERE name = 'Télévision & Audiovisuel'), 'operates_in', 'Canal+ Group operates in Télévision & Audiovisuel sector', NOW(), NOW()),

-- CNews relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'CNews'), 'owns', 'Vivendi owns CNews', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'CNews'), 'manages', 'Vincent Bolloré manages CNews through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'CNews'), 'sector', (SELECT id FROM sectors WHERE name = 'Télévision & Audiovisuel'), 'operates_in', 'CNews operates in Télévision & Audiovisuel sector', NOW(), NOW()),

-- C8 relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'C8'), 'owns', 'Vivendi owns C8', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'C8'), 'manages', 'Vincent Bolloré manages C8 through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'C8'), 'sector', (SELECT id FROM sectors WHERE name = 'Télévision & Audiovisuel'), 'operates_in', 'C8 operates in Télévision & Audiovisuel sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Radio & Audio relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Europe 1 relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Europe 1'), 'owns', 'Vivendi owns Europe 1', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Europe 1'), 'manages', 'Vincent Bolloré manages Europe 1 through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Europe 1'), 'sector', (SELECT id FROM sectors WHERE name = 'Radio & Audio'), 'operates_in', 'Europe 1 operates in Radio & Audio sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Publicité & Marketing relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Havas relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Havas'), 'owns', 'Vivendi owns Havas', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Yannick Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Havas'), 'manages', 'Yannick Bolloré manages Havas through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Havas'), 'sector', (SELECT id FROM sectors WHERE name = 'Publicité & Marketing'), 'operates_in', 'Havas operates in Publicité & Marketing sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Cinéma & Production relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Studiocanal relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Studiocanal'), 'owns', 'Vivendi owns Studiocanal', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Maxime Saada'), 'company', (SELECT id FROM companies WHERE name = 'Studiocanal'), 'manages', 'Maxime Saada manages Studiocanal through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Studiocanal'), 'sector', (SELECT id FROM sectors WHERE name = 'Cinéma & Production'), 'operates_in', 'Studiocanal operates in Cinéma & Production sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Presse & Edition relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Prisma Media relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Prisma Media'), 'owns', 'Vivendi owns Prisma Media', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Prisma Media'), 'manages', 'Vincent Bolloré manages Prisma Media through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Prisma Media'), 'sector', (SELECT id FROM sectors WHERE name = 'Presse & Edition'), 'operates_in', 'Prisma Media operates in Presse & Edition sector', NOW(), NOW()),

-- Le Journal du Dimanche relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Le Journal du Dimanche'), 'owns', 'Vivendi owns Le Journal du Dimanche', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Le Journal du Dimanche'), 'manages', 'Vincent Bolloré manages Le Journal du Dimanche through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Le Journal du Dimanche'), 'sector', (SELECT id FROM sectors WHERE name = 'Presse & Edition'), 'operates_in', 'Le Journal du Dimanche operates in Presse & Edition sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Jeux Vidéo & Gaming relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Gameloft relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Gameloft'), 'owns', 'Vivendi owns Gameloft', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Gameloft'), 'manages', 'Vincent Bolloré manages Gameloft through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Gameloft'), 'sector', (SELECT id FROM sectors WHERE name = 'Jeux Vidéo & Gaming'), 'operates_in', 'Gameloft operates in Jeux Vidéo & Gaming sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Streaming & Digital relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Dailymotion relations
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Dailymotion'), 'owns', 'Vivendi owns Dailymotion', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Maxime Saada'), 'company', (SELECT id FROM companies WHERE name = 'Dailymotion'), 'manages', 'Maxime Saada manages Dailymotion through Vivendi', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Dailymotion'), 'sector', (SELECT id FROM sectors WHERE name = 'Streaming & Digital'), 'operates_in', 'Dailymotion operates in Streaming & Digital sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Holdings & Investissement relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Bolloré SE relations
('fund', (SELECT id FROM funds WHERE name = 'Groupe Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Bolloré SE'), 'owns', 'Groupe Bolloré owns Bolloré SE', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Vincent Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Bolloré SE'), 'manages', 'Vincent Bolloré manages Bolloré SE through Groupe Bolloré', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Bolloré SE'), 'sector', (SELECT id FROM sectors WHERE name = 'Holdings & Investissement'), 'operates_in', 'Bolloré SE operates in Holdings & Investissement sector', NOW(), NOW()),

-- Nouvelles relations Bolloré
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Universal Music Group'), 'owns', 'Vivendi détient 10% d''UMG après spin-off, Bolloré contrôle 18% indirectement via sa participation Vivendi', NOW(), NOW()),
('fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'company', (SELECT id FROM companies WHERE name = 'Lagardère SA'), 'controls', 'Vivendi-Bolloré contrôle 57,95% du capital et 50,50% des droits de vote de Lagardère', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Lagardère SA'), 'company', (SELECT id FROM companies WHERE name = 'Paris Match'), 'owns', 'Lagardère propriétaire de Paris Match', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Lagardère SA'), 'company', (SELECT id FROM companies WHERE name = 'Hachette Livre'), 'owns', 'Lagardère propriétaire de Hachette Livre', NOW(), NOW()),

-- Relations nouvelles personnalités Bolloré (investigation ChatGPT)
('personality', (SELECT id FROM personalities WHERE name = 'Cyrille Bolloré'), 'fund', (SELECT id FROM funds WHERE name = 'Groupe Bolloré'), 'manages', 'Cyrille Bolloré est PDG du Groupe Bolloré depuis 2019', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Cyrille Bolloré'), 'fund', (SELECT id FROM funds WHERE name = 'Vivendi'), 'manages', 'Cyrille Bolloré est administrateur de Vivendi', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Marie Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Blue Solutions'), 'manages', 'Marie Bolloré est CEO de Blue Solutions (batteries) depuis 2017', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Sébastien Bolloré'), 'company', (SELECT id FROM companies WHERE name = 'Compagnie de l''Odet'), 'manages', 'Sébastien Bolloré est DG adjoint de la Compagnie de l''Odet', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Claire Léost'), 'company', (SELECT id FROM companies WHERE name = 'Prisma Media'), 'manages', 'Claire Léost est Présidente de Prisma Media depuis 2021', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Serge Nedjar'), 'company', (SELECT id FROM companies WHERE name = 'CNews'), 'manages', 'Serge Nedjar est directeur général de CNews depuis 2016', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Serge Nedjar'), 'company', (SELECT id FROM companies WHERE name = 'Prisma Media'), 'manages', 'Serge Nedjar est directeur des rédactions de Prisma Media depuis 2025', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Alexandre de Rochefort'), 'company', (SELECT id FROM companies WHERE name = 'Gameloft'), 'manages', 'Alexandre de Rochefort est CEO de Gameloft depuis 2023', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pascal Praud'), 'company', (SELECT id FROM companies WHERE name = 'CNews'), 'manages', 'Pascal Praud présente l''émission phare "L''Heure des Pros" sur CNews', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Cyril Hanouna'), 'company', (SELECT id FROM companies WHERE name = 'C8'), 'manages', 'Cyril Hanouna produit et présente "Touche pas à mon poste !" sur C8', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Sonia Mabrouk'), 'company', (SELECT id FROM companies WHERE name = 'Europe 1'), 'manages', 'Sonia Mabrouk présente la matinale politique sur Europe 1', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Sonia Mabrouk'), 'company', (SELECT id FROM companies WHERE name = 'CNews'), 'manages', 'Sonia Mabrouk présente "Midi News" sur CNews', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Geoffroy Lejeune'), 'company', (SELECT id FROM companies WHERE name = 'Le Journal du Dimanche'), 'manages', 'Geoffroy Lejeune est directeur de la rédaction du JDD depuis 2023', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 8. ARNAULT RELATIONS CREATION
-- =====================================================

-- Main Arnault relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, start_date, notes, "createdAt", "updatedAt") VALUES
-- Bernard Arnault owns Groupe Arnault (Agache)
('personality', (SELECT id FROM personalities WHERE name = 'Bernard Arnault'), 'fund', (SELECT id FROM funds WHERE name = 'Groupe Arnault (Agache)'), 'owns', '1989-01-01', 'Fondateur et propriétaire du holding familial (Agache/Groupe Arnault)', NOW(), NOW()),

-- Groupe Arnault controls LVMH
('fund', (SELECT id FROM funds WHERE name = 'Groupe Arnault (Agache)'), 'company', (SELECT id FROM companies WHERE name = 'LVMH'), 'controls', NULL, 'Contrôle majoritaire de LVMH via 41% Dior + parts directes (~48% capital, >60% droits de vote)', NOW(), NOW()),

-- Groupe Arnault invested in Carrefour (2007-2021)
('fund', (SELECT id FROM funds WHERE name = 'Groupe Arnault (Agache)'), 'company', (SELECT id FROM companies WHERE name = 'Carrefour'), 'invests_in', '2007-03-01', 'Participation (~9.8%) dans Carrefour via Blue Capital (avec Colony Capital)', NOW(), NOW()),

-- LVMH owns Les Echos-Le Parisien
('company', (SELECT id FROM companies WHERE name = 'LVMH'), 'company', (SELECT id FROM companies WHERE name = 'Les Echos-Le Parisien'), 'owns', '2015-10-30', 'LVMH propriétaire à 100% des journaux Les Echos (depuis 2007) et Le Parisien (depuis 2015)', NOW(), NOW()),

-- LVMH operates in Luxury & Fashion sector
('company', (SELECT id FROM companies WHERE name = 'LVMH'), 'sector', (SELECT id FROM sectors WHERE name = 'Luxury & Fashion'), 'operates_in', NULL, 'LVMH est actif dans le luxe (mode, joaillerie, vins, etc.)', NOW(), NOW()),

-- Les Echos-Le Parisien operates in Media & Communication sector
('company', (SELECT id FROM companies WHERE name = 'Les Echos-Le Parisien'), 'sector', (SELECT id FROM sectors WHERE name = 'Media & Communication'), 'operates_in', NULL, 'Activité de presse écrite et médias', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Bernard Arnault controls LVMH
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('personality', (SELECT id FROM personalities WHERE name = 'Bernard Arnault'), 'company', (SELECT id FROM companies WHERE name = 'LVMH'), 'controls', 'Président-directeur général et actionnaire majoritaire de LVMH', NOW(), NOW()),

-- Bernard Arnault owns Les Echos-Le Parisien (via LVMH)
('personality', (SELECT id FROM personalities WHERE name = 'Bernard Arnault'), 'company', (SELECT id FROM companies WHERE name = 'Les Echos-Le Parisien'), 'owns', 'Propriétaire des journaux Les Echos et Le Parisien via LVMH', NOW(), NOW()),

-- Bernard Arnault invested in Carrefour (via holding)
('personality', (SELECT id FROM personalities WHERE name = 'Bernard Arnault'), 'company', (SELECT id FROM companies WHERE name = 'Carrefour'), 'invests_in', 'Participation (~9.8%) dans Carrefour via sa holding Blue Capital', NOW(), NOW()),

-- Nouvelles relations ajoutées de l'enquête ChatGPT Arnault
-- Christian Dior SE détient LVMH
('company', (SELECT id FROM companies WHERE name = 'Christian Dior SE'), 'company', (SELECT id FROM companies WHERE name = 'LVMH'), 'détention_capital', '41,87% du capital LVMH au 31/12/2024 ; ~57% des droits de vote (famille Arnault totalisant ~64% en 2024-2025).', NOW(), NOW()),

-- Bernard Arnault fonde Fondation Louis Vuitton
('personality', (SELECT id FROM personalities WHERE name = 'Bernard Arnault'), 'company', (SELECT id FROM companies WHERE name = 'Fondation Louis Vuitton'), 'founded', 'Commanditaire et président ; outil d''influence culturelle et soft power.', NOW(), NOW()),

-- Aglaé Ventures investit dans Back Market, Spotify, Slack, Airbnb
('company', (SELECT id FROM companies WHERE name = 'Aglaé Ventures'), 'company', (SELECT id FROM companies WHERE name = 'Back Market'), 'invests_in', 'Portefeuille Aglaé (site officiel).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Aglaé Ventures'), 'company', (SELECT id FROM companies WHERE name = 'Spotify'), 'invests_in', 'Portefeuille Aglaé (site officiel).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Aglaé Ventures'), 'company', (SELECT id FROM companies WHERE name = 'Slack'), 'invests_in', 'Portefeuille Aglaé (site officiel).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Aglaé Ventures'), 'company', (SELECT id FROM companies WHERE name = 'Airbnb'), 'invests_in', 'Portefeuille Aglaé (site officiel).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Family members manage LVMH
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
-- Delphine Arnault manages LVMH
('personality', (SELECT id FROM personalities WHERE name = 'Delphine Arnault'), 'company', (SELECT id FROM companies WHERE name = 'LVMH'), 'manages', 'Administratrice de LVMH et DG de Christian Dior Couture', NOW(), NOW()),

-- Antoine Arnault manages LVMH
('personality', (SELECT id FROM personalities WHERE name = 'Antoine Arnault'), 'company', (SELECT id FROM companies WHERE name = 'LVMH'), 'manages', 'Responsable communication du groupe LVMH', NOW(), NOW()),

-- Alexandre Arnault manages LVMH (via Tiffany)
('personality', (SELECT id FROM personalities WHERE name = 'Alexandre Arnault'), 'company', (SELECT id FROM companies WHERE name = 'LVMH'), 'manages', 'VP exécutif chez Tiffany & Co. (filiale LVMH)', NOW(), NOW()),

-- Frédéric Arnault manages LVMH (via TAG Heuer)
('personality', (SELECT id FROM personalities WHERE name = 'Frédéric Arnault'), 'company', (SELECT id FROM companies WHERE name = 'LVMH'), 'manages', 'CEO de TAG Heuer (marque LVMH)', NOW(), NOW()),

-- Jean Arnault manages LVMH
('personality', (SELECT id FROM personalities WHERE name = 'Jean Arnault'), 'company', (SELECT id FROM companies WHERE name = 'LVMH'), 'manages', 'Directeur marketing horlogerie chez Louis Vuitton', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Brand management relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, start_date, notes, "createdAt", "updatedAt") VALUES
-- Delphine Arnault manages Christian Dior
('personality', (SELECT id FROM personalities WHERE name = 'Delphine Arnault'), 'brand', (SELECT id FROM brands WHERE name = 'Christian Dior'), 'manages', '2023-01-11', 'CEO de Christian Dior Couture', NOW(), NOW()),

-- Antoine Arnault managed Berluti (2011-2023)
('personality', (SELECT id FROM personalities WHERE name = 'Antoine Arnault'), 'brand', (SELECT id FROM brands WHERE name = 'Berluti'), 'manages', '2011-01-01', 'Directeur Général de Berluti (2011 à 2023)', NOW(), NOW()),

-- Alexandre Arnault manages Tiffany & Co.
('personality', (SELECT id FROM personalities WHERE name = 'Alexandre Arnault'), 'brand', (SELECT id FROM brands WHERE name = 'Tiffany & Co.'), 'manages', '2021-01-01', 'Vice-président exécutif Produits & Communication chez Tiffany & Co.', NOW(), NOW()),

-- Frédéric Arnault manages TAG Heuer
('personality', (SELECT id FROM personalities WHERE name = 'Frédéric Arnault'), 'brand', (SELECT id FROM brands WHERE name = 'TAG Heuer'), 'manages', '2020-07-01', 'CEO de TAG Heuer', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- LVMH acquired Tiffany & Co.
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, start_date, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name = 'LVMH'), 'brand', (SELECT id FROM brands WHERE name = 'Tiffany & Co.'), 'acquired', '2021-01-07', 'Acquisition de Tiffany & Co. pour 15,8 milliards $ en 2021', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
