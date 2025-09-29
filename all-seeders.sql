-- =====================================================
-- PERICLES SEEDER - COMPLETE SQL SCRIPT
-- =====================================================
-- This script creates all entities and relations from pericles.seeder.ts
-- Uses UPSERT pattern (INSERT ... ON CONFLICT ... DO UPDATE) for idempotent execution

-- =====================================================
-- 1. SECTORS CREATION
-- =====================================================

INSERT INTO sectors (name, description, published, "createdAt") VALUES
('Politique et Think Tank', 'Secteur politique et organisations de réflexion', true, NOW()),
('Éducation & Formation', 'Secteur de l''éducation, des écoles et de la formation en ligne', true, NOW()),
('Technologie & Digital', 'Secteur des technologies, plateformes digitales et logiciels', true, NOW()),
('Santé & Bien-être', 'Secteur de la santé, bien-être et santé mentale', true, NOW()),
('Divertissement & Loisirs', 'Secteur du divertissement, jeux et loisirs', true, NOW()),
('Alimentation & Nutrition', 'Secteur de l''alimentation, nutrition et nourriture pour animaux', true, NOW()),
('Automobile & Transport', 'Secteur automobile et transport', true, NOW()),
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

-- =====================================================
-- 2. FUND CREATION
-- =====================================================

INSERT INTO funds (name, description, published, "createdAt") VALUES
('Otium Capital', 'Holding d''investissements privée creee en 2009 par Pierre-Edouard Sterin, spécialisée dans l''industrie, loisirs, immobilier, santé, consumer et Tech. 1,7 Md€ d''actifs, 255 M€ déployés en 2024.', true, NOW()),
-- Fonds Bolloré
('Vivendi', 'Conglomérat français de médias et de communication contrôlé par le groupe Bolloré. Actionnaire majoritaire de Canal+, Havas, et autres actifs médias.', true, NOW()),
('Groupe Bolloré', 'Conglomérat français contrôlé par la famille Bolloré. Actionnaire de référence de Vivendi et de diverses entreprises industrielles et médiatiques.', true, NOW()),
-- Fonds Arnault
('Groupe Arnault (Agache)', 'Holding familiale des Arnault (Agache), détient ~97% de Christian Dior SE et ~48% de LVMH. Véhicule d''investissement fondé par Bernard Arnault.', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  published = EXCLUDED.published;

-- =====================================================
-- 3. PERSONALITY CREATION
-- =====================================================

INSERT INTO personalities (name, description, published, "createdAt") VALUES
('Pierre-Édouard Stérin', 'Milliardaire francais, fondateur et architecte du projet Pericles, visant à promouvoir des valeurs conservatrices et influencer la politique francaise', true, NOW()),
-- Personnalités Bolloré
('Vincent Bolloré', 'Milliardaire français, président et actionnaire de contrôle du groupe Bolloré, influence majeure sur les médias français via Vivendi', true, NOW()),
('Yannick Bolloré', 'Président du conseil de surveillance de Vivendi et PDG de Havas, fils de Vincent Bolloré', true, NOW()),
('Maxime Saada', 'PDG du Groupe Canal+ et Président de Studiocanal, figure majeure de la télévision payante française', true, NOW()),
-- Personnalités Arnault
('Bernard Arnault', 'Milliardaire français, PDG du groupe de luxe LVMH. Principal actionnaire via sa holding familiale. Influence politique et économique considérable.', true, NOW()),
('Delphine Arnault', 'Fille aînée de Bernard Arnault, dirigeante de LVMH (DG de Christian Dior Couture depuis 2023, administratrice de LVMH).', true, NOW()),
('Antoine Arnault', 'Fils de Bernard Arnault, ancien DG de Berluti (2011-2023), PDG de Christian Dior SE (holding) depuis 2022, en charge de la communication du groupe.', true, NOW()),
('Alexandre Arnault', 'Fils de Bernard Arnault, VP exécutif de Tiffany & Co. depuis 2021 (après rachat par LVMH), ex-DG de Rimowa.', true, NOW()),
('Frédéric Arnault', 'Fils de Bernard Arnault, PDG de TAG Heuer depuis 2020, pilote la stratégie horlogère du groupe.', true, NOW()),
('Jean Arnault', 'Fils cadet de Bernard Arnault, directeur du marketing horlogerie chez Louis Vuitton.', true, NOW()),
('Xavier Niel', 'Gendre de Bernard Arnault (époux de Delphine Arnault) et entrepreneur des télécoms (fondateur d''Iliad/Free).', true, NOW()),
('François Pinault', 'Homme d''affaires milliardaire, fondateur de Kering (anciennement PPR). Rival historique de Bernard Arnault dans le luxe (Gucci, etc.).', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  published = EXCLUDED.published;

-- =====================================================
-- 4. COMPANIES CREATION
-- =====================================================

-- Luxury & Fashion companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Adore Me', 'Marque de lingerie et de vêtements de nuit', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Almé', 'Marque de vêtements et accessoires de mode', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Ana Luisa', 'Marque de bijoux et accessoires de mode', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Chnge', 'Marque de vêtements éco-responsables', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Dialect', 'Marque de cosmétiques et beauté', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Dossier', 'Marque de cosmétiques et soins', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Equivalenza', 'Cosmétiques et parfums de luxe', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Merci Handy', 'Produits d''hygiène et soins personnels', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Tekyn', 'Technologies textiles et mode', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- =====================================================
-- 4. COMPANIES CREATION (GENERATED)
-- =====================================================

-- Éducation & Formation companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Albert School', 'École de commerce et de management', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('bestapeople', 'Plateforme de formation et développement personnel', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Master Camp', 'Formation et développement des compétences', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Technologie & Digital companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('99digital', 'Agence digitale et marketing', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Alfeor', 'Plateforme technologique innovante', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Amenitiz', 'Solution SaaS pour l''hôtellerie', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Animaj', 'Studio d''animation et de création', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Aria', 'Plateforme de musique et streaming', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Arianee', 'Plateforme blockchain et NFT', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Altratech', 'Technologies alternatives et durables', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Aya', 'Application mobile et plateforme digitale', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Comet', 'Plateforme de collaboration et gestion de projet', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('E-peas', 'Technologies d''énergie et IoT', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Enosium', 'Plateforme technologique innovante', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Ensol', 'Solutions énergétiques durables', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Fintool', 'Outils financiers et investissement', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('FJ Labs', 'Laboratoire d''innovation technologique', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Flagcat', 'Plateforme de gestion et monitoring', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Hadrena', 'Solutions technologiques avancées', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Hani', 'Plateforme digitale et services', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Hyppo', 'Technologies mobiles et applications', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('IB2', 'Solutions d''intelligence business', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('ISAI', 'Fonds d''investissement technologique', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Jimmy', 'Plateforme de services et applications', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Join', 'Plateforme de connexion et networking', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Just', 'Solutions technologiques justes', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Katoo', 'Plateforme de restauration et livraison', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Kiliba', 'Technologies de gestion et organisation', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Lead Edge Capital', 'Fonds d''investissement en capital-risque', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('LightOn', 'Intelligence artificielle et recherche', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('MatX', 'Matériaux innovants et technologies', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Metomic', 'Sécurité des données et conformité', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Nebular', 'Technologies cloud et infrastructure', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Néolithe', 'Technologies environnementales et durables', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('One Pilot', 'Plateforme de pilotage et gestion', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Orcan', 'Solutions énergétiques renouvelables', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Otelium', 'Technologies hôtelières et touristiques', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Owkin', 'Intelligence artificielle en santé', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('OXP', 'Plateforme d''expérience utilisateur', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Payfit', 'Solution de paie et ressources humaines', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Piloc', 'Plateforme de localisation et navigation', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Prello', 'Plateforme de voyage et hébergement', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Proov Station', 'Stations de recharge et mobilité', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Prosper', 'Plateforme de financement et investissement', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Quinten', 'Solutions de trading et investissement', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Raise Seed for good', 'Plateforme de financement solidaire', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Revibe', 'Plateforme de musique et découverte', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Rzilient', 'Solutions de résilience et continuité', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Shippeo', 'Plateforme de suivi logistique', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Silvr', 'Solutions de paiement et fintech', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('TechLife Capital', 'Fonds d''investissement en technologies', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('The Oasis House', 'Plateforme de bien-être et lifestyle', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('The Refiners', 'Solutions de raffinage et optimisation', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Tomorro', 'Plateforme de planification et organisation', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Tuio', 'Plateforme d''assurance et services financiers', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('VSORA', 'Technologies de vision et reconnaissance', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Zeliq', 'Plateforme de liquidité et trading', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Santé & Bien-être companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Ananda', 'Plateforme de bien-être et méditation', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Clay', 'Solution de santé mentale et bien-être', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('DentalCo', 'Solutions dentaires et orthodontiques', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Dermae', 'Produits de soin de la peau', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Novavet', 'Médecine vétérinaire et soins animaux', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Nyxoah', 'Technologies médicales innovantes', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Quantum Genomics', 'Recherche génomique et médecine personnalisée', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Sym Optic', 'Optique et lunettes de vue', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('SixtySixty', 'Marque de lunettes et optique', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Divertissement & Loisirs companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Beat the bomb', 'Expérience de jeu immersif et interactif', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Dynamo', 'Centre de sport et fitness', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Fort Boyard Aventures', 'Parc d''aventures et loisirs', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Giftory', 'Plateforme de cadeaux et expériences', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Hapik', 'Parc d''escalade et activités sportives', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Kids Empire', 'Parc de jeux pour enfants', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Kojump', 'Parc de trampolines et activités', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Smartbox', 'Coffrets cadeaux et expériences', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('SpeedPark', 'Parc de karting et sports motorisés', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Stage11', 'Plateforme de gaming et esport', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Terragame', 'Parc de jeux et divertissements', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Yumon', 'Parc de loisirs et attractions', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Alimentation & Nutrition companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('BeFC', 'Solutions d''emballage alimentaire durable', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Caats', 'Nourriture pour animaux de compagnie', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Feed.', 'Plateforme de livraison de repas', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Féfé', 'Restaurant et cuisine gastronomique', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('la Pataterie', 'Restaurant spécialisé dans les pommes de terre', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Automobile & Transport companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Carsell', 'Plateforme de vente de véhicules', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;




-- Pericles company
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Pericles', 'Le projet Pericles (cree en 2023) est une initiative politique et metapolitique concue pour promouvoir les valeurs identitaires, traditionalistes et conservatrices, et favoriser une alliance durable entre l''extreme droite et la droite liberale conservatrice. Il vise a infiltrer le debat public via les medias, les reseaux sociaux, la production audiovisuelle, les sondages, les influenceurs - afin de maitriser la fenetre d''Overton et decredibiliser les idees adverses. Budget de 150 millions d''euros sur 10 ans, dont deja une partie engagee', 'https://fr.wikipedia.org/wiki/Projet_P%C3%A9ricl%C3%A8s', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- =====================================================
-- 4.5. BOLLORÉ COMPANIES CREATION
-- =====================================================

-- Télévision & Audiovisuel companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Canal+ Group', 'Groupe de télévision à péage français, diffuseur premium et producteur de contenus, fleuron de l''empire médiatique de Vivendi', 'https://www.canalplusgroup.com', true, NOW()),
('CNews', 'Chaîne de télévision française d''information en continu, appartenant au Groupe Canal+', 'https://www.cnews.fr', true, NOW()),
('C8', 'Chaîne de télévision généraliste française, appartenant au Groupe Canal+', 'https://www.c8.fr', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Radio & Audio companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Europe 1', 'Station de radio généraliste française, appartenant à Lagardère (participation Vivendi)', 'https://www.europe1.fr', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Publicité & Marketing companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Havas', 'Groupe français de communication et publicité, sixième groupe mondial, propriété de Vivendi', 'https://www.havas.com', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Cinéma & Production companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Studiocanal', 'Société française de production et distribution cinématographique, filiale du Groupe Canal+', 'https://www.studiocanal.com', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Presse & Edition companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Prisma Media', 'Groupe français d''édition de magazines, propriété de Vivendi', 'https://www.prismamedia.com', true, NOW()),
('Le Journal du Dimanche', 'Hebdomadaire français d''information, appartenant au groupe Lagardère (participation Vivendi)', 'https://www.lejdd.fr', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Jeux Vidéo & Gaming companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Gameloft', 'Éditeur et développeur français de jeux vidéo mobile, filiale de Vivendi', 'https://www.gameloft.com', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Streaming & Digital companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Dailymotion', 'Plateforme française d''hébergement et de partage de vidéos, propriété de Vivendi', 'https://www.dailymotion.com', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Holdings & Investissement companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Bolloré SE', 'Société d''investissement et holding industriel français contrôlé par Vincent Bolloré', 'https://www.bollore.com', true, NOW()),
('Vivendi SE', 'Conglomérat français de médias et de communication, contrôlé par le groupe Bolloré. Propriétaire de Canal+, Havas, et autres actifs médiatiques majeurs.', 'https://www.vivendi.com', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- =====================================================
-- 4.6. ARNAULT COMPANIES CREATION
-- =====================================================

-- Luxury & Fashion companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('LVMH', 'LVMH Moët Hennessy Louis Vuitton, numéro un mondial du luxe avec plus de 70 marques (Louis Vuitton, Dior, Bulgari, etc.). Bernard Arnault en est PDG et actionnaire majoritaire (via sa holding).', 'https://www.lvmh.com', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Retail companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Carrefour', 'Groupe français de grande distribution. Bernard Arnault a détenu ~10% de Carrefour de 2007 à 2021 via Blue Capital (partenariat avec Colony Capital).', 'https://www.carrefour.com', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Media & Communication companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Les Echos-Le Parisien', 'Groupe de presse détenu par LVMH (Les Echos, quotidien économique, acquis en 2007, et Le Parisien, quotidien régional/national, acquis en 2015).', 'https://lesechosleparisien.fr', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- =====================================================
-- 4.7. ARNAULT BRANDS CREATION
-- =====================================================

INSERT INTO brands (name, description, source, published, "createdAt", company_id) VALUES
('Christian Dior', 'Marque de mode de luxe emblématique (haute couture, prêt-à-porter, maroquinerie). Acquise par Bernard Arnault en 1984, intégrée à LVMH. Delphine Arnault en est la DG depuis 2023.', 'https://www.dior.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('TAG Heuer', 'Manufacture horlogère suisse renommée pour ses montres sportives. Fait partie de LVMH (division Montres & Joaillerie). Frédéric Arnault en est PDG depuis 2020.', 'https://www.tagheuer.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Tiffany & Co.', 'Joaillier de luxe américain (fondé en 1837), célèbre pour ses diamants et son Blue Box. Racheté par LVMH en 2021 pour 15,8 Mds$. Alexandre Arnault y occupe un poste de direction.', 'https://www.tiffany.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Berluti', 'Marque de luxe masculine (chaussures, maroquinerie, prêt-à-porter) fondée en 1895 et acquise par LVMH. Antoine Arnault a été DG de Berluti (2011-2023).', 'https://www.berluti.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH'))
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- =====================================================
-- 5. ENTITY RELATIONS CREATION
-- =====================================================

-- Main relations (Pierre-Edouard Stérin, Otium Capital, Pericles)
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, start_date, notes, "createdAt", "updatedAt") VALUES
-- Pierre-Edouard Stérin founded Otium Capital
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'founded', '2009-01-01', 'Pierre-Edouard Sterin founded Otium Capital in 2009', NOW(), NOW()),

-- Otium Capital operates in political sector
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'sector', (SELECT id FROM sectors WHERE name = 'Politique et Think Tank'), 'operates_in', NULL, 'Otium Capital has investments in political/think tank sector', NOW(), NOW()),

-- Otium Capital owns Pericles
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Pericles'), 'owns', '2023-01-01', 'Otium Capital finances the Pericles project', NOW(), NOW()),

-- Pierre-Edouard Stérin controls Pericles
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Pericles'), 'controls', '2023-01-01', 'Pierre-Edouard Sterin is the architect of the Pericles project', NOW(), NOW()),

-- Pericles operates in political sector
('company', (SELECT id FROM companies WHERE name = 'Pericles'), 'sector', (SELECT id FROM sectors WHERE name = 'Politique et Think Tank'), 'operates_in', NULL, 'Pericles is a political and metapolitical initiative', NOW(), NOW())

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
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'bestapeople'), 'owns', 'Otium Capital owns bestapeople', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'bestapeople'), 'manages', 'Pierre-Edouard Sterin manages bestapeople through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'bestapeople'), 'sector', (SELECT id FROM sectors WHERE name = 'Éducation & Formation'), 'operates_in', 'bestapeople operates in Éducation & Formation sector', NOW(), NOW()),
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
('company', (SELECT id FROM companies WHERE name = 'BeFC'), 'sector', (SELECT id FROM sectors WHERE name = 'Alimentation & Nutrition'), 'operates_in', 'BeFC operates in Alimentation & Nutrition sector', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- Automobile & Transport relations
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Carsell'), 'owns', 'Otium Capital owns Carsell', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Carsell'), 'manages', 'Pierre-Edouard Sterin manages Carsell through Otium Capital', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Carsell'), 'sector', (SELECT id FROM sectors WHERE name = 'Automobile & Transport'), 'operates_in', 'Carsell operates in Automobile & Transport sector', NOW(), NOW())

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
('company', (SELECT id FROM companies WHERE name = 'Bolloré SE'), 'sector', (SELECT id FROM sectors WHERE name = 'Holdings & Investissement'), 'operates_in', 'Bolloré SE operates in Holdings & Investissement sector', NOW(), NOW())

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
('personality', (SELECT id FROM personalities WHERE name = 'Bernard Arnault'), 'company', (SELECT id FROM companies WHERE name = 'Carrefour'), 'invests_in', 'Participation (~9.8%) dans Carrefour via sa holding Blue Capital', NOW(), NOW())

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
((SELECT id FROM personalities WHERE name = 'Bernard Arnault'), (SELECT id FROM personalities WHERE name = 'Xavier Niel'), 'is_family_of', 'Beau-père et gendre (Xavier Niel a épousé Delphine Arnault en 2010)', NOW(), NOW()),

-- Rivalry between Bernard Arnault and François Pinault
((SELECT id FROM personalities WHERE name = 'Bernard Arnault'), (SELECT id FROM personalities WHERE name = 'François Pinault'), 'is_rival_of', 'Rival de longue date dans le secteur du luxe (LVMH vs Kering, bataille Gucci)', NOW(), NOW())

ON CONFLICT (source_personality_id, target_personality_id, relation_type) DO NOTHING;
