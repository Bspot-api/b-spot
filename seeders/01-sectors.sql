-- =====================================================
-- SECTORS SEEDER
-- =====================================================
-- Creates all business sectors used to categorize companies
-- Uses UPSERT pattern (INSERT ... ON CONFLICT ... DO UPDATE)

INSERT INTO sectors (name, description, icon, published, "createdAt") VALUES
('Politique et Think Tank', 'Secteur politique et organisations de réflexion', 'Landmark', true, NOW()),
('Éducation & Formation', 'Secteur de l''éducation, des écoles et de la formation en ligne', 'GraduationCap', true, NOW()),
('Technologie & Digital', 'Secteur des technologies, plateformes digitales et logiciels', 'Laptop', true, NOW()),
('Santé & Bien-être', 'Secteur de la santé, bien-être et santé mentale', 'Heart', true, NOW()),
('Divertissement & Loisirs', 'Secteur du divertissement, jeux et loisirs', 'PartyPopper', true, NOW()),
('Alimentation & Nutrition', 'Secteur de l''alimentation, nutrition et nourriture pour animaux', 'Utensils', true, NOW()),
('Automobile & Transport', 'Secteur automobile et transport', 'Car', true, NOW()),
('Loisirs', 'Secteur des loisirs et activités récréatives', 'Gamepad2', true, NOW()),
('Hôtellerie', 'Secteur de l''hôtellerie et hébergement', 'Hotel', true, NOW()),
('Industrie & Énergie', 'Secteur industriel et énergétique', 'Factory', true, NOW()),
('Immobilier', 'Secteur immobilier et proptech', 'Home', true, NOW()),
-- Secteurs Bolloré
('Holdings & Investissement', 'Secteur des holdings et sociétés d''investissement', 'Briefcase', true, NOW()),
('Télévision & Audiovisuel', 'Secteur de la télévision, chaînes et production audiovisuelle', 'Tv', true, NOW()),
('Radio & Audio', 'Secteur de la radio et contenus audio', 'Radio', true, NOW()),
('Publicité & Marketing', 'Secteur de la publicité, marketing et communication', 'Megaphone', true, NOW()),
('Cinéma & Production', 'Secteur du cinéma et de la production audiovisuelle', 'Film', true, NOW()),
('Presse & Edition', 'Secteur de la presse, édition et médias écrits', 'Newspaper', true, NOW()),
('Jeux Vidéo & Gaming', 'Secteur des jeux vidéo et du gaming', 'Gamepad', true, NOW()),
('Streaming & Digital', 'Secteur du streaming et plateformes digitales', 'MonitorPlay', true, NOW()),
-- Secteurs Arnault
('Luxury & Fashion', 'Secteur du luxe comprenant mode, maroquinerie, joaillerie, horlogerie, vins & spiritueux. Arnault domine ce secteur via LVMH.', 'Sparkles', true, NOW()),
('Media & Communication', 'Secteur des médias, télévision, radio, presse et communication. Arnault possède Les Echos et Le Parisien.', 'Rss', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  published = EXCLUDED.published;
