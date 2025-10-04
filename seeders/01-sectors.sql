-- =====================================================
-- SECTORS SEEDER
-- =====================================================
-- Creates all business sectors used to categorize companies
-- Uses UPSERT pattern (INSERT ... ON CONFLICT ... DO UPDATE)

INSERT INTO sectors (name, description, published, "createdAt") VALUES
('Politique et Think Tank', 'Secteur politique et organisations de réflexion', true, NOW()),
('Éducation & Formation', 'Secteur de l''éducation, des écoles et de la formation en ligne', true, NOW()),
('Technologie & Digital', 'Secteur des technologies, plateformes digitales et logiciels', true, NOW()),
('Santé & Bien-être', 'Secteur de la santé, bien-être et santé mentale', true, NOW()),
('Divertissement & Loisirs', 'Secteur du divertissement, jeux et loisirs', true, NOW()),
('Alimentation & Nutrition', 'Secteur de l''alimentation, nutrition et nourriture pour animaux', true, NOW()),
('Automobile & Transport', 'Secteur automobile et transport', true, NOW()),
('Loisirs', 'Secteur des loisirs et activités récréatives', true, NOW()),
('Hôtellerie', 'Secteur de l''hôtellerie et hébergement', true, NOW()),
('Industrie & Énergie', 'Secteur industriel et énergétique', true, NOW()),
('Immobilier', 'Secteur immobilier et proptech', true, NOW()),
-- Secteurs Bolloré
('Holdings & Investissement', 'Secteur des holdings et sociétés d''investissement', true, NOW()),
('Télévision & Audiovisuel', 'Secteur de la télévision, chaînes et production audiovisuelle', true, NOW()),
('Radio & Audio', 'Secteur de la radio et contenus audio', true, NOW()),
('Publicité & Marketing', 'Secteur de la publicité, marketing et communication', true, NOW()),
('Cinéma & Production', 'Secteur du cinéma et de la production audiovisuelle', true, NOW()),
('Presse & Edition', 'Secteur de la presse, édition et médias écrits', true, NOW()),
('Jeux Vidéo & Gaming', 'Secteur des jeux vidéo et du gaming', true, NOW()),
('Streaming & Digital', 'Secteur du streaming et plateformes digitales', true, NOW()),
-- Secteurs Arnault
('Luxury & Fashion', 'Secteur du luxe comprenant mode, maroquinerie, joaillerie, horlogerie, vins & spiritueux. Arnault domine ce secteur via LVMH.', true, NOW()),
('Media & Communication', 'Secteur des médias, télévision, radio, presse et communication. Arnault possède Les Echos et Le Parisien.', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  published = EXCLUDED.published;
