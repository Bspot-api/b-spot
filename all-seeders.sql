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
('Otium Capital', 'Holding d''investissement privée/family office fondée en 2009 par Pierre-Édouard Stérin. AUM ~1,7 Md€ ; IRR 25% (depuis 2015) ; >130 sociétés soutenues. CEO : François Durvye. 190 M€ investis en 2023, objectif 300 M€ en 2024.', true, NOW()),
-- Fonds Bolloré
('Vivendi', 'Conglomérat français de médias et de communication contrôlé par le groupe Bolloré. Actionnaire majoritaire de Canal+, Havas, et autres actifs médias.', true, NOW()),
('Groupe Bolloré', 'Conglomérat français contrôlé par la famille Bolloré. Actionnaire de référence de Vivendi et de diverses entreprises industrielles et médiatiques.', true, NOW()),
-- Fonds Arnault
('Groupe Arnault (Agache)', 'Holding familiale des Arnault (Agache), détient ~97% de Christian Dior SE. La famille Arnault totalise ~48% capital / ~64% droits de vote LVMH.', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  published = EXCLUDED.published;

-- =====================================================
-- 3. PERSONALITY CREATION
-- =====================================================

INSERT INTO personalities (name, description, published, "createdAt") VALUES
('Pierre-Édouard Stérin', 'Fondateur & Président d''Otium Capital ; entrepreneur (Smartbox). Commanditaire du projet Périclès.', true, NOW()),
('François Durvye', 'CEO d''Otium Capital ; bras droit de P.-É. Stérin. Rôle opérationnel dans l''écosystème Périclès.', true, NOW()),
-- Personnalités Bolloré
('Vincent Bolloré', 'Milliardaire français, président et actionnaire de contrôle du groupe Bolloré, influence majeure sur les médias français via Vivendi', true, NOW()),
('Yannick Bolloré', 'Président du conseil de surveillance de Vivendi et PDG de Havas, fils de Vincent Bolloré', true, NOW()),
('Maxime Saada', 'PDG du Groupe Canal+ et Président de Studiocanal, figure majeure de la télévision payante française', true, NOW()),
-- Personnalités Arnault
('Bernard Arnault', 'Milliardaire français, PDG du groupe de luxe LVMH. Principal actionnaire via sa holding familiale. Influence politique et économique considérable.', true, NOW()),
('Delphine Arnault', 'PDG de Christian Dior Couture depuis le 01/02/2023 ; membre du CA et du Comex de LVMH. Fille aînée de Bernard Arnault.', true, NOW()),
('Antoine Arnault', 'Vice-président & DG de Christian Dior SE (holding) depuis 12/2022 ; Directeur Image & Environnement LVMH. Fils de Bernard Arnault.', true, NOW()),
('Alexandre Arnault', 'EVP Product & Communications, Tiffany & Co. (depuis 2021) ; ex-CEO de Rimowa. Fils de Bernard Arnault.', true, NOW()),
('Frédéric Arnault', 'Ex-CEO TAG Heuer ; CEO LVMH Watches (01/2024), puis nommé CEO de Loro Piana à compter de 06/2025. Fils de Bernard Arnault.', true, NOW()),
('Jean Arnault', 'Directeur du développement Horlogerie chez Louis Vuitton (depuis 2021). Fils cadet de Bernard Arnault.', true, NOW()),
('Xavier Niel', 'Fondateur d''Iliad/Free ; partenaire de Delphine Arnault depuis 2010 ; co-actionnaire du Groupe Le Monde (avec protection capitalistique via le Fonds pour l''indépendance).', true, NOW()),
('François Pinault', 'Homme d''affaires milliardaire, fondateur de Kering (anciennement PPR). Rival historique de Bernard Arnault dans le luxe (Gucci, etc.).', true, NOW()),
-- Nouvelles personnalités découvertes
('Igor Carron', 'Co-fondateur et dirigeant de LightOn, startup française d''IA générative. Expert en intelligence artificielle appliquée.', true, NOW()),
('Laurent Daudet', 'Co-fondateur de LightOn, professeur et expert en IA. Co-créateur de la technologie d''IA générative de LightOn.', true, NOW()),
('Thomas Clozel', 'Co-fondateur et CEO d''Owkin, médecin spécialisé en onco-hématologie. Pionnier de l''IA appliquée à la recherche médicale.', true, NOW()),
('Firmin Zocchetto', 'Co-fondateur de PayFit, expert en solutions RH et paie digitales. Dirigeant de la licorne française PayFit.', true, NOW()),
-- Nouvelles personnalités écosystème Bolloré (investigation ChatGPT)
('Cyrille Bolloré', 'Fils de Vincent Bolloré, Président-Directeur général du Groupe Bolloré depuis 2019 et administrateur de Vivendi. Successeur de son père à la tête du conglomérat familial.', true, NOW()),
('Marie Bolloré', 'Fille de Vincent Bolloré, responsable de la division Electromobilité du groupe Bolloré et Directrice générale de Blue Solutions (batteries) depuis 2017.', true, NOW()),
('Sébastien Bolloré', 'Fils de Vincent Bolloré, DG adjoint de la Compagnie de l''Odet (holding familiale) et conseiller du groupe Bolloré pour les nouveaux médias et technologies.', true, NOW()),
('Claire Léost', 'Présidente de Prisma Media depuis 2021, nommée après le rachat par Vivendi. Chargée d''accélérer la transformation numérique du groupe de magazines.', true, NOW()),
('Serge Nedjar', 'Dirigeant de médias, directeur général de CNews et proche de Vincent Bolloré. Nommé en 2025 directeur des rédactions de Prisma Media tout en conservant CNews.', true, NOW()),
('Alexandre de Rochefort', 'Directeur général de Gameloft depuis 2023, nommé par Vivendi pour accélérer la croissance multiplateforme de l''éditeur de jeux vidéo mobile.', true, NOW()),
('Pascal Praud', 'Journaliste et animateur TV, présentateur star de CNews connu pour son ton pro-conservateur. Figure de proue de la chaîne d''opinion de Vincent Bolloré.', true, NOW()),
('Cyril Hanouna', 'Animateur et producteur de C8, figure centrale de "Touche pas à mon poste !". Proche de Vincent Bolloré, utilise son émission populaire pour soutenir l''union des droites (RN-LR).', true, NOW()),
('Sonia Mabrouk', 'Journaliste sur Europe 1 et CNews, réputée pour ses interviews musclées et une grille de lecture proche de la droite identitaire. Son arrivée symbolise l''orientation éditoriale imprimée par Bolloré.', true, NOW()),
('Geoffroy Lejeune', 'Journaliste et éditorialiste d''extrême droite, ex-rédacteur en chef de Valeurs actuelles. Propulsé en 2023 à la tête du JDD malgré une grève massive de la rédaction, symbolisant le virage ultraconservateur imposé par Bolloré.', true, NOW())
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
('Master Camp', 'Formation et développement des compétences', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Technologie & Digital companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('99digital', 'Agence digitale et marketing', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Alfeor', 'Plateforme de consolidation dans l''industrie nucléaire, soutenue par Otium Capital.', 'https://www.alfeor.com/', true, NOW()),
('Amenitiz', 'SaaS tout-en-un pour hôteliers indépendants : PMS, channel manager, moteur de réservation, site web.', 'https://amenitiz.com/en/', true, NOW()),
('Animaj', 'Studio média enfants qui acquiert/développe des IP numériques (notamment chaînes YouTube).', 'https://www.animaj.com/', true, NOW()),
('Aria', 'Fintech FR : infrastructure de paiement différé pour plateformes/marketplaces B2B. Série A 15 M€ (12/2023).', 'https://www.finextra.com/newsarticle/43420/french-fintech-aria-raises-15-million', true, NOW()),
('Arianee', 'Protocole & solutions d''identités produits (NFT/DPP) pour marques, déployé sur blockchains publiques (ex : Polygon).', 'https://www.arianee.com/', true, NOW()),
('Altratech', 'Technologies alternatives et durables', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Aya', 'Application mobile et plateforme digitale', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Comet', 'Place de marché de freelances IT/data (matching en <48h, 9k+ experts).', 'https://www.comet.co/', true, NOW()),
('E-peas', 'Technologies d''énergie et IoT', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Enosium', 'Société de services dans les sciences de la vie, fondée en 2024 avec le soutien d''Otium Capital.', 'https://www.enosium.com/', true, NOW()),
('Ensol', 'Climat/énergie résidentielle : fourniture/financement d''équipements solaires et stockage pour foyers (levée €14 M en 04/2025).', 'https://www.vestbee.com/insights/articles/ensol-secures-14-m', true, NOW()),
('Fintool', 'Outils financiers et investissement', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('FJ Labs', 'Fonds de capital-risque global (marketplaces/consumer), cofondé par Fabrice Grinda.', 'https://www.fjlabs.com/', true, NOW()),
('Flagcat', 'Studio créatif à Paris (IP "webtoon/franchises" & contenus).', 'https://www.flagcat.studio/', true, NOW()),
('Hadrena', 'Société de loisirs et divertissement (anciennement Otium Leisure), exploitant 150+ centres.', 'https://www.hadrena.com/', true, NOW()),
('Hyppo', 'Fintech/proptech spécialisée dans le financement patrimonial et refinancement immobilier (levée 3M€ Otium Capital).', 'https://www.hyppo.immo/', true, NOW()),
('IB2', 'Greentech procédés : raffinage d''alumine à partir de bauxites pauvres (industrie aluminium).', 'https://ib2.com/', true, NOW()),
('ISAI', 'Fonds d''entrepreneurs français (seed, venture & growth) actif dans la tech.', 'https://www.isai.fr/', true, NOW()),
('Jimmy', 'Startup cleantech développant des solutions nucléaires pour la décarbonation industrielle (levée 15M€ avec Otium Capital).', 'https://www.jimmy-energy.eu/', true, NOW()),
('Join', 'Plateforme de connexion et networking', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Just', 'Fintech spécialisée dans les solutions de paiement one-click pour e-commerce (levée 3M€ menée par Otium Capital).', 'https://www.just.fr/', true, NOW()),
('Katoo', 'Plateforme commandes/restauration (ES) – intégrée à Choco (2021–2022).', 'https://www.linkedin.com/company/katoo-app', true, NOW()),
('Kiliba', 'Plateforme d''automatisation marketing avec IA (levée 7M€ menée par Otium Capital, 400+ clients, 1M€ ARR).', 'https://www.kiliba.com/', true, NOW()),
('Lead Edge Capital', 'Growth equity (≈ $5 Md AUM) – tickets $25–300 M – software/Internet/tech-enabled.', 'https://leadedge.com/', true, NOW()),
('LightOn', 'Deeptech IA (photonic computing puis GenAI on-prem). Investisseurs : Otium Capital, Quantonation, Anorak… IPO sur Euronext Growth (26/11/2024).', 'https://www.hpcwire.com/off-the-wire/lighton-photonic-co-processor-integrated-into-european-ai-supercomputer/ ; https://www.lighton.ai/investors', true, NOW()),
('MatX', 'Matériaux innovants et technologies', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Metomic', 'Data security / DLP pour SaaS & GenAI : découverte/classification/contrôle de données sensibles dans les apps cloud.', 'https://www.metomic.io/', true, NOW()),
('Nebular', 'Fonds de venture capital early-stage basé à New York (fondé 2023, investit pre-seed/seed US/Europe).', 'https://www.nebular.vc/', true, NOW()),
('Néolithe', 'Traitement des déchets non-recyclables par "fossilisation" pour produire des granulats bas-carbone.', 'https://neolithe.com/', true, NOW()),
('Onepilot', 'Externalisation de service client (care, sales, KYC) 24/7 avec agents humains augmentés par l''IA.', 'https://onepilot.co/', true, NOW()),
('Orcan Energy', 'Conversion de chaleur fatale en électricité (modules ORC). Otium Capital actionnaire depuis 01/2023.', 'https://www.orcan-energy.com/en/details/orcan-energy-welcomes-otium-capital-as-a-new-shareholder.html', true, NOW()),
('Otelium', 'Plateforme d''investissement/repositionnement & exploitation d''hôtels indépendants en France.', 'https://www.otelium.com/en/', true, NOW()),
('Owkin', 'Biotech IA (onco/biomarkers). Série A 11 M$ (01/2018) menée par Otium Venture avec Cathay Innovation, Plug & Play, NJF Capital ; extensions 2020 avec Bpifrance Large Venture, MACSF, GV, F-Prime, Eight Roads, Mubadala (total ≈70 M$). 11/2021 : investissement de 180 M$ par Sanofi + partenariat multi-annuel (4 cancers). 06/2022 : alliance stratégique avec Bristol Myers Squibb (80 M$ upfront + B-1 equity). Statut unicorn (≥1 Md$) annoncé.', 'https://www.biospace.com/owkin-closes-11m-series-a-financing-round ; https://www.sanofi.com/en/media-room/press-releases/2021/2021-11-18-06-30-00-2336966 ; https://www.owkin.com/newsfeed/owkin-becomes-unicorn-with-180m-investment-from-sanofi-and-four-new-collaborative-projects ; https://www.owkin.com/newsfeed/owkin-announces-multi-year-clinical-data-science-strategic-collaboration-with-bristol-myers-squibb', true, NOW()),
('OXP', 'Outils digitaux pour architectes/designers ; extension UP intégrée à SketchUp pour modélisation & demandes de devis marques.', 'https://mom.maison-objet.com/en/brand/15268/oxp', true, NOW()),
('Payfit', 'SaaS paie/RH pour PME. Tour de 5 M€ en 10/2016 mené par Otium Venture et Xavier Niel ; tour B de 14 M€ en 07/2017 mené par Accel avec participation d''Otium.', 'https://tech.eu/2016/10/11/payfit-e5-million/ ; https://techcrunch.com/2017/07/06/payfit-raises-159-million-to-manage-european-payrolls/', true, NOW()),
('Piloc', 'Solution de paiement/automatisation des encaissements pour professionnels de l''immobilier (B2B loyers).', 'https://lespepitestech.com/startup-de-la-french-tech/piloc', true, NOW()),
('Prello', 'Immobilier fractionné/résidences secondaires (co-achat, conciergerie).', 'https://www.prello.co/', true, NOW()),
('Proov Station', 'Inspection automobile automatisée par IA : portiques/scanners drive-through (retail, remarketing, location).', 'https://www.proovstation.com/', true, NOW()),
('Prosper', 'Plateforme de financement et investissement - Désactivé faute d''identification univoque (Prosper US P2P lending ; Prosper UK ISA/pensions).', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Quinten Health', 'IA & data science santé (RWD/RWE, modélisation de parcours, accès au marché). Partenariat annoncé avec Aetion pour générer et valider des insights RWE via IA/ML.', 'https://www.quinten-health.com/ ; https://news.aetion.com/aetion-quinten-health-partnership-ai-rwe', true, NOW()),
('Raise Seed for good', 'Plateforme de financement solidaire', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Revibe', 'Place de marché reconditionné/refurb (électronique) opérée par une équipe FR (fondée 2022, EAU).', 'https://help.revibe.me/en-US/what-is-revibe-352752', true, NOW()),
('Rzilient', 'Plateforme de gestion de parc IT (achats/MDM, supervision, support, leasing, Green IT).', 'https://en.rzilient.club/', true, NOW()),
('Shippeo', 'Plateforme de visibilité supply-chain temps réel. Amorçage (2 M€) mené par Otium Venture (2016) ; Série A 10 M€ en 11/2017 menée par Partech et Otium Venture.', 'https://www.shippeo.com/press-releases/shippeo-raises-10-million-euro-series-a-2', true, NOW()),
('Silvr', 'Financement non-dilutif (RBF) pour e-commerçants et SaaS, adossé aux revenus.', 'https://silvr.co/', true, NOW()),
('TechLife Capital', 'Fonds growth equity dédié à la santé (medtech, services & logiciels).', 'https://www.techlifecapital.com/', true, NOW()),
('The Oasis House', 'Plateforme de bien-être et lifestyle', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('The Refiners', 'Accélérateur seed basé à San Francisco, dédié aux fondateurs internationaux (programme, réseau, funding).', 'https://www.linkedin.com/company/the-refiners', true, NOW()),
('Tomorro', 'CLM (Contract Lifecycle Management) alimenté par l''IA ; rebrand de Leeway en 12/2023.', 'https://www.tomorro.com/', true, NOW()),
('Tuio', 'Assurtech 100% digitale (ES) : multirisques habitation, auto, vie/empreinte IA.', 'https://tuio.com/', true, NOW()),
('VSORA', 'Fabless FR : puces d''inférence IA (data centers/edge) ; levée $46 M en 04/2025.', 'https://vsora.com/', true, NOW()),
('Zeliq', 'Plateforme de prospection commerciale (450M+ contacts, séquences omnicanales).', 'https://www.zeliq.com/', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Santé & Bien-être companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Ananda', 'Plateforme de bien-être et méditation', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Clay', 'Solution de santé mentale et bien-être', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('DentalCo', 'Solutions dentaires et orthodontiques', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Dermae', 'Produits de soin de la peau', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Novavet', 'Réseau de cliniques vétérinaires et services animaliers en France.', 'https://novavet.fr/', true, NOW()),
('Nyxoah', 'Medtech apnée du sommeil (OSA) – système Genio® (stimulation du nerf hypoglosse). IPO Euronext Bruxelles (09/2020) ; offre Nasdaq (07/2021). Actionnaires clés historiques : Cochlear, Gilde Healthcare, ResMed.', 'https://live.euronext.com/en/ipo-showcase/nyxoah ; https://www.nasdaq.com/press-release/nyxoah-announces-pricing-of-nasdaq-public-offering-2021-07-02 ; https://investors.nyxoah.com/shareholder-information ; https://nyxoah.com/', true, NOW()),
('Quantum Genomics', 'Biotech cardio-métabolique (firibastat). Échec de l''essai de phase III FRESH (10/2022), restructuration puis déclaration de cessation de paiements (09/2024).', 'https://www.globenewswire.com/news-release/2022/10/28/2543536/0/en/Quantum-Genomics-Announces-Lack-of-Significant-Efficacy-for-Firibastat-in-Their-Phase-III-Study-FRESH-and-is-Redirecting-to-New-Developments.html ; https://www.actusnews.com/en/quantum-genomics/pr/2024/09/04/quantum-genomics-reviewed-its-financial-situation-and-announced-that-it-has-filed-a-declaration-of-cessation-of-payment-today', true, NOW()),
('Sym Optic', 'Parcours optique/audiologie mobile : examens de vue en "médicobus", télé-expertise & lunettes (FR).', 'https://sym-lab.com/', true, NOW()),
('SixtySixty', 'Retail optique "sight-on-site" (exams et lunettes en point de vente ; FR).', 'https://www.linkedin.com/company/sixtysixty', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Divertissement & Loisirs companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Beat the bomb', 'Expérience de team-building "escape + arcade" avec scénarios immersifs (USA).', 'https://www.beatthebomb.com/', true, NOW()),
('Dynamo', 'Centre de sport et fitness', 'https://www.instagram.com/p/DLejL_eioIV/', false, NOW()),
('Fort Boyard Aventures', 'Parcs indoor "action-game" officiels inspirés de l''émission Fort Boyard (défis grandeur nature).', 'https://www.fortboyardaventures.fr/', true, NOW()),
('Giftory', 'Marketplace d''expériences-cadeaux (5 000+ activités), bons sans expiration (US).', 'https://www.giftory.com/', true, NOW()),
('Hapik', 'Réseau de salles d''escalade "fun climbing" (FR/US).', 'https://hapik.fr/', true, NOW()),
('Kids Empire', 'Réseau de parcs indoor pour enfants (100+ parcs aux USA).', 'https://kidsempire.com/locations', true, NOW()),
('Kojump', 'Parc de trampolines et activités', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('Smartbox', 'Leader européen des coffrets cadeaux d''expériences (séjours, gastronomie, bien-être, loisirs).', 'https://www.smartbox.com/fr/', true, NOW()),
('SpeedPark', 'Parcs de loisirs indoor multi-activités (karting, bowling, laser game, arcade, quiz room).', 'https://speedpark.fr/', true, NOW()),
('Stage11', 'Startup "music × metaverse" (expériences immersives pour artistes/marques). Seed menée par Otium.', 'https://www.stage11.com/', true, NOW()),
('Terragame', 'Centres de réalité virtuelle "hyper-réalité" (expériences free-roaming multi-joueurs).', 'https://terragamecenter.com/en/home/', true, NOW()),
('Yumon', 'Jeux "real-time fantasy" pour créateurs (monétisation communautaire sur base web3).', 'https://www.yumon.com/', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Alimentation & Nutrition companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('BeFC', 'Deeptech "paper batteries" : piles bio-enzymatiques ultra-minces pour capteurs/IoT médical (électronique durable).', 'https://www.befc.fr/', true, NOW()),
('Caats', 'DNVB pet-food pour chats, modèle abonnement (FR).', 'https://caats.co/', true, NOW()),
('Feed.', 'Repas et snacks fonctionnels 100% végétaux (bars & shakers), nutrition équilibrée prête à consommer.', 'https://www.feed.co/', true, NOW()),
('Féfé', 'Restaurant et cuisine gastronomique', 'https://www.instagram.com/p/DLejL_eioIV/', true, NOW()),
('la Pataterie', 'Chaîne de restaurants française spécialisée en recettes autour de la pomme de terre.', 'https://www.lapataterie.fr/', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Automobile & Transport companies
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Vell', 'Réseau d''agents automobile (reprise/vente de véhicules) – nouvelle marque "Vell".', 'https://vell.co/', true, NOW())

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;




-- Pericles company
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Périclès (association)', 'Association créée en 07/2023 soutenue par Pierre-Édouard Stérin. Projet métapolitique annoncé à 150 M€ sur 10 ans pour "générer, conseiller et financer des initiatives" (site), décrit par Le Monde comme visant l''union des droites.', 'https://periclesfrance.org/ ; https://www.lemonde.fr/en/france/article/2024/07/21/a-french-billionaire-s-plan-to-enable-victory-for-the-far-right_6692554_7.html', true, NOW()),
-- Projets écosystème Périclès
('Souveraine Tech', 'Média en ligne sur la souveraineté techno/numérique, soutenu via Périclès/"Maison du Bien commun".', 'https://www.lemonde.fr/pixels/article/2025/03/03/pericles-souveraine-tech-le-media-soutenu-par-le-projet-du-milliardaire-conservateur_6575420_4408996.html', true, NOW()),
-- Co-investisseurs identifiés
('Partech', 'Société de capital-risque internationale.', 'https://www.shippeo.com/press-releases/shippeo-raises-10-million-euro-series-a-2', true, NOW()),
('Cathay Innovation', 'Fonds VC (groupe Cathay Capital).', 'https://www.cathaycapital.com/owkin-closes-11-million-series-a-financing-round/', true, NOW()),
('GV (ex-Google Ventures)', 'Corporate VC d''Alphabet.', 'https://www.wsj.com/articles/medical-ai-startup-owkin-adds-to-series-a-1527109455', true, NOW()),
-- Entreprises acquéreurs
('Choco', 'Plateforme commandes B2B pour restaurants/fournisseurs.', 'https://choco.com/', true, NOW()),
('Lectra', 'Solutions Industrie 4.0 pour mode/auto/meuble.', 'https://www.lectra.com/en', true, NOW()),
-- Co-investisseurs Owkin ajoutés micro-lot 2.4
('Bpifrance Large Venture', 'Fonds growth/late-stage de Bpifrance, investisseur Owkin (2020).', 'https://www.goodwinlaw.com/en/news-and-events/news/2020/05/05_14-goodwin-advises-bpi-large-venture', true, NOW()),
('MACSF', 'Mutuelle d''Assurances du Corps de Santé Français – investisseur Owkin (2020).', 'https://www.cathaycapital.com/owkin-raises-25-million-as-it-builds-a-secure-network-for-healthcare-analysis-and-research/', true, NOW()),
('Mubadala Capital', 'Venture arm d''Abu Dhabi – investisseur Owkin (Série A ext. 06/2020).', 'https://www.wamda.com/2020/07/mubadala-capital-invests-frances-owkin', true, NOW()),
('GV (Google Ventures)', 'Corporate VC d''Alphabet – investisseur Owkin (2018)', 'https://www.venturecapitaljournal.com/gv-provides-funding-ai-startup-owkin/', true, NOW()),
('Eight Roads Ventures', 'VC global (ex-Fidelity Growth Partners) – investisseur Owkin (A-ext. 2020).', 'https://www.businessinsider.com/owkin-healthcare-startup-raises-25-million-2020-5', true, NOW()),
('F-Prime Capital', 'VC (Fidelity) – investisseur Owkin (A-ext. 2020).', 'https://www.businessinsider.com/owkin-healthcare-startup-raises-25-million-2020-5', true, NOW()),
('Bristol Myers Squibb', 'Pharma US – alliance stratégique & investissement B-1 Owkin (06/2022).', 'https://www.owkin.com/newsfeed/owkin-announces-multi-year-clinical-data-science-strategic-collaboration-with-bristol-myers-squibb', true, NOW()),
('Sanofi', 'Pharma FR – 180 M$ d''equity + collaboration multi-annuelle avec Owkin (11/2021).', 'https://www.reuters.com/business/healthcare-pharmaceuticals/drugmaker-sanofi-invests-180-mln-french-ai-startup-owkin-2021-11-18/', true, NOW()),
('Aetion', 'Plateforme RWE (Harvard/ICER) utilisée par l''industrie pour générer des preuves en vie réelle (RWD).', 'https://news.aetion.com/aetion-quinten-health-partnership-ai-rwe', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- =====================================================
-- 4.6. OTIUM PORTFOLIO COMPANIES (LOT 3)
-- =====================================================

-- Plateformes Otium Partners (roll-up)
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Comet Software', 'Plateforme "roll-up" éditeur de logiciels métiers (business software) portée par Otium Partners.', 'https://www.otiumcapital.com/en/news/white-paper-the-roll-up-strategy-a-true-value-catalyst/', true, NOW()),
('Otelium', 'Plateforme d''investissement & d''exploitation hôtelière (hôtels économiques urbains).', 'https://www.otiumcapital.com/en/news/white-paper-the-roll-up-strategy-a-true-value-catalyst/', true, NOW()),
('Alfeor', 'Groupe équipementier de la filière nucléaire (plateforme roll-up Otium Partners).', 'https://www.otiumcapital.com/en/news/white-paper-the-roll-up-strategy-a-true-value-catalyst/', true, NOW()),
('Enosium Life Science', 'Plateforme de services scientifiques pour l''industrie santé (CRO/affaires réglementaires/MA/medical affairs).', 'https://www.otiumcapital.com/en/news/enosium-life-science-accelerates-path-to-european-leadership-in-healthcare-scientific-services-with-three-strategic-acquisitions/', true, NOW()),
('Novavet', 'Plateforme santé animale (réseau de cliniques & services vétérinaires).', 'https://www.otiumcapital.com/en/news/white-paper-the-roll-up-strategy-a-true-value-catalyst/', true, NOW()),
('Hadrena', 'Plateforme loisirs locaux (FEC/multi-activités : SpeedPark, Koezio, etc.).', 'https://www.otiumcapital.com/en/news/otium-leisure-announces-e140-million-in-financing-to-create-a-european-leader-of-family-entertainment-centers/', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Division Studio (création de startups)
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Otium Studio', 'Startup studio intégré d''Otium (objectif >10 lancements/an ; >180 M€ alloués d''ici 2030).', 'https://www.otiumcapital.com/en/news/otium-doubles-down-with-e180m-investment-in-otium-studio-through-2030/', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Participations Otium Investment / Venture
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('VSORA', 'Fabless de puces d''inférence IA très haute performance (levée 46 M$ en 04/2025 menée par Otium).', 'https://www.otiumcapital.com/en/news/vsora-raises-46-million-to-bring-ultra-high-performance-ai-inference-chip-to-market/', true, NOW()),
('Orcan Energy', 'Cleantech ORC : conversion de chaleur fatale en électricité ; Otium actionnaire depuis 01/2023.', 'https://www.orcan-energy.com/en/news/category/press-reports.html', true, NOW()),
('Amenitiz', 'SaaS hôtelier tout-en-un (PMS, channel manager, moteur de résa) ; Otium lead seed 2019 et suivi Série A 2022.', 'https://techcrunch.com/2022/04/05/amenitiz-series-a/', true, NOW()),
('Rzilient', 'Plateforme de gestion de parc IT/MDM & support ; tour avec Otium.', 'https://pitchbook.com/profiles/company/482642-20', true, NOW()),
('Metomic', 'Data Security/DLP pour apps SaaS & GenAI ; investisseur lié (Resonance VC d''Otium).', 'https://www.metomic.io/resource-centre/metomic-raises-20-million-to-protect-sensitive-data-in-saas-applications', true, NOW()),
('Prello', 'Proptech co-achat de résidences secondaires (seed 13 M€ menée par Otium, 02/2022).', 'https://nordic9.com/news/prello-secured-13-million-from-from-otium-capital-and-axeleo/', true, NOW()),
('Aria', 'Infra de paiement différé B2B pour plateformes/marketplaces (Série A 12/2023 avec Otium).', 'https://adevinta.com/press-releases/adevinta-ventures-invests-in-arias-series-a-funding-round/', true, NOW()),
('PayFit', 'SaaS paie RH ; Otium (ex-Otium Venture/Frst) dès 2016.', 'https://techcrunch.com/2016/10/11/payfit-grabs-56-million-to-manage-french-payrolls/', true, NOW()),
('Shippeo', 'Visibilité transport temps réel ; seed 2016 & Série A 2017 avec Otium Venture.', 'https://www.shippeo.com/press-releases/shippeo-raises-10-million-euro-series-a-2', true, NOW()),
('Otium Leisure', 'Véhicule/plateforme FEC (financement 140 M€ en 09/2024).', 'https://www.otiumcapital.com/en/news/otium-leisure-announces-e140-million-in-financing-to-create-a-european-leader-of-family-entertainment-centers/', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  published = EXCLUDED.published;

-- Co-investisseurs VSORA (tour 04/2025)
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Omnes Capital', 'Investisseur PE/VC européen (stratégies deeptech, villes durables, énergie).', 'https://www.omnescapital.com/', true, NOW()),
('Adélie Capital', 'Fonds multi-stage tech (Paris/Londres).', 'https://www.adelie.vc/', true, NOW()),
('EIC Fund', 'Fonds d''investissement du Conseil européen de l''innovation (co-financement deeptech).', 'https://eic.ec.europa.eu/eic-fund/about-eic-fund_en', true, NOW())
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
('Europe 1', 'Station de radio généraliste française, appartenant au groupe Lagardère (désormais contrôlé par Vivendi-Bolloré depuis 2022)', 'https://www.europe1.fr', true, NOW())
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
('Le Journal du Dimanche', 'Hebdomadaire français d''actualité, appartenant au groupe Lagardère (désormais contrôlé par Vivendi-Bolloré depuis 2022)', 'https://www.lejdd.fr', true, NOW())
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
('Vivendi SE', 'Conglomérat français de médias et de communication, contrôlé par le groupe Bolloré. Propriétaire de Canal+, Havas, et autres actifs médiatiques majeurs.', 'https://www.vivendi.com', true, NOW()),
('Universal Music Group', 'Major mondiale de l''industrie musicale, ex-filiale de Vivendi. Spin-off en 2021 avec distribution de 60% aux actionnaires. Bolloré détient environ 18% après l''introduction en bourse (7 milliards $ de valeur).', 'https://www.universalmusic.com', true, NOW()),
('Lagardère SA', 'Groupe français d''édition et médias acquis par Vivendi-Bolloré en 2023. Propriétaire d''Europe 1, JDD, Paris Match, Hachette Livre. Valorisation OPA 24,1€/action.', 'https://www.lagardere.com', true, NOW()),
('Paris Match', 'Magazine hebdomadaire français, propriété de Lagardère donc contrôlé par Vivendi-Bolloré depuis 2023.', 'https://www.parismatch.com', true, NOW()),
('Hachette Livre', 'Premier éditeur français, filiale de Lagardère contrôlée par Vivendi-Bolloré. Leader européen de l''édition.', 'https://www.hachette.com', true, NOW()),
-- Holdings intermédiaires Bolloré (investigation ChatGPT)
('Compagnie de Cornouaille', 'Holding intermédiaire du groupe Bolloré (détention de Vivendi, UMG...), fusionnée dans Bolloré SE en 2024. Ancienne structure de contrôle capitalistique.', 'https://www.bollore.com', true, NOW()),
('Financière V', 'Holding familiale privée créée par Vincent Bolloré dans les années 1980, échelon du contrôle capitalistique du groupe Bolloré entre Bolloré Participations et Sofibol.', NULL, true, NOW())
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

-- Nouvelles entreprises Arnault ajoutées de l'enquête ChatGPT
INSERT INTO companies (name, description, source, published, "createdAt") VALUES
('Christian Dior SE', 'Holding cotée contrôlée par la famille Arnault. Détient 41,87% du capital de LVMH au 31/12/2024 ; ~57% des droits de vote via Dior + participations familiales.', 'https://www.dior-finance.com/', true, NOW()),
('Aglaé Ventures', 'Fonds VC tech adossé à Agache (ex-Groupe Arnault). Tickets de 100 K€ à 100 M€ ; participations : Back Market, Spotify, Slack, Airbnb, etc.', 'https://aglaeventures.com/', true, NOW()),
('Fondation Louis Vuitton', 'Institution culturelle (Paris, Bois de Boulogne), bâtiment signé Frank Gehry, ouverte au public depuis le 27/10/2014.', 'https://www.fondationlouisvuitton.fr/', true, NOW()),
('Belmond', 'Groupe d''hôtellerie de luxe acquis par LVMH (transaction EV 3,2 Md$ ; closing 2019).', 'https://www.lvmh.com/en/publications/lvmh-completes-the-agreement-with-belmond', true, NOW()),
-- Entreprises du portefeuille Aglaé Ventures
('Back Market', 'Marketplace de produits électroniques reconditionnés.', 'https://www.backmarket.fr/', true, NOW()),
('Spotify', 'Plateforme de streaming musical.', 'https://www.spotify.com/', true, NOW()),
('Slack', 'Plateforme de communication d''équipe.', 'https://www.slack.com/', true, NOW()),
('Airbnb', 'Plateforme de location de logements entre particuliers.', 'https://www.airbnb.fr/', true, NOW())
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
('Berluti', 'Marque de luxe masculine (chaussures, maroquinerie, prêt-à-porter) fondée en 1895 et acquise par LVMH. Antoine Arnault a été DG de Berluti (2011-2023).', 'https://www.berluti.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Louis Vuitton', 'Marque de maroquinerie de luxe emblématique, fondée en 1854. Fleuron de LVMH, première marque de luxe mondiale en valorisation.', 'https://www.louisvuitton.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Moët & Chandon', 'Maison de champagne fondée en 1743, symbole du champagne français dans le monde. Chiffre d''affaires de plusieurs milliards d''euros.', 'https://www.moet.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Hennessy', 'Premier producteur mondial de cognac, fondé en 1765. Marque de spiritueux la plus valorisée de LVMH.', 'https://www.hennessy.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Bulgari', 'Joaillier et horloger italien de luxe fondé en 1884, acquis par LVMH en 2011 pour 3,7Md€.', 'https://www.bulgari.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Sephora', 'Chaîne de parfumerie et cosmétiques, 3000 magasins dans 35 pays. Acquisition LVMH 1997, croissance digitale forte.', 'https://www.sephora.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Fendi', 'Marque de mode italienne fondée en 1925, acquise par LVMH en 2001. Spécialisée maroquinerie et fourrure de luxe.', 'https://www.fendi.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Celine', 'Marque de mode française fondée en 1945, acquise par LVMH en 1996. Direction artistique Hedi Slimane depuis 2018.', 'https://www.celine.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Givenchy', 'Maison de couture française fondée en 1952 par Hubert de Givenchy, acquise par LVMH en 1988.', 'https://www.givenchy.com', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
-- Nouvelles marques LVMH ajoutées de l'enquête ChatGPT
('Loewe', 'Maison espagnole de maroquinerie et prêt-à-porter.', 'https://www.lvmh.com/en/our-maisons', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Rimowa', 'Bagagerie haut de gamme (coques aluminium & polycarbonate).', 'https://www.lvmh.com/en/our-maisons', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Parfums Christian Dior', 'Parfums & cosmétiques (segment LVMH, distinct de Dior Couture).', 'https://www.lvmh.com/en/our-maisons', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Guerlain', 'Parfums & beauté (maison fondée en 1828).', 'https://www.lvmh.com/en/our-maisons', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Hublot', 'Horlogerie suisse (fusion des matériaux).', 'https://www.lvmh.com/en/our-maisons', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Zenith', 'Horlogerie suisse (El Primero).', 'https://www.lvmh.com/en/our-maisons', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Veuve Clicquot', 'Champagne.', 'https://www.lvmh.com/en/our-maisons/wines-spirits', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Dom Pérignon', 'Champagne prestige.', 'https://www.lvmh.com/en/our-maisons/wines-spirits', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Krug', 'Champagne maison de prestige.', 'https://www.lvmh.com/en/our-maisons/wines-spirits', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH')),
('Glenmorangie', 'Single malt whisky (Écosse).', 'https://www.lvmh.com/en/our-maisons/wines-spirits', true, NOW(), (SELECT id FROM companies WHERE name = 'LVMH'))
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
('fund', (SELECT id FROM funds WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'soutien_financier', 'Otium Capital/Stérin financent le projet Périclès (150M€ / 10 ans).', NOW(), NOW()),

-- Pierre-Edouard Stérin controls Périclès
('personality', (SELECT id FROM personalities WHERE name = 'Pierre-Édouard Stérin'), 'company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'initiateur', 'Commanditaire/porteur du projet Périclès ; financement annoncé 150 M€ / 10 ans.', NOW(), NOW()),

-- François Durvye relations avec Otium et Périclès
('personality', (SELECT id FROM personalities WHERE name = 'François Durvye'), 'company', (SELECT id FROM companies WHERE name = 'Otium Capital'), 'dirige', 'Directeur général (CEO).', NOW(), NOW()),
('personality', (SELECT id FROM personalities WHERE name = 'François Durvye'), 'company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'animateur', 'Rôle opérationnel/soutien au dispositif (portraits & enquêtes).', NOW(), NOW()),

-- Périclès soutient Souveraine Tech
('company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'company', (SELECT id FROM companies WHERE name = 'Souveraine Tech'), 'soutien_financier', 'Lauréat/financé via écosystème "Maison du Bien commun" lié à Stérin.', NOW(), NOW()),

-- Relations d''investissement détaillées
-- Xavier Niel co-investit avec Otium sur PayFit
('personality', (SELECT id FROM personalities WHERE name = 'Xavier Niel'), 'company', (SELECT id FROM companies WHERE name = 'Payfit'), 'co-investisseur', 'Co-lead 5 M€ (2016) ; participation au tour B (2017).', NOW(), NOW()),

-- Co-investisseurs Shippeo
('company', (SELECT id FROM companies WHERE name = 'Partech'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'co-investisseur', 'Co-lead Série A 10 M€ (11/2017) avec Otium Venture.', NOW(), NOW()),

-- Co-investisseurs Owkin
('company', (SELECT id FROM companies WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'investisseur', 'Lead Série A (11 M$, 01/2018).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Cathay Innovation'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'co-investisseur', 'Participation à la Série A 2018.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'GV (ex-Google Ventures)'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'investisseur', 'Extension Série A (05/2018) avec GV.', NOW(), NOW()),

-- LightOn relation investisseur Otium
('company', (SELECT id FROM companies WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'LightOn'), 'investisseur', 'Otium listé parmi les investisseurs (deeptech/photonic, puis GenAI).', NOW(), NOW()),

-- Périclès operates in political sector
('company', (SELECT id FROM companies WHERE name = 'Périclès (association)'), 'sector', (SELECT id FROM sectors WHERE name = 'Politique et Think Tank'), 'operates_in', 'Initiative métapolitique annoncée à 150M€ sur 10 ans.', NOW(), NOW()),

-- Relations d''acquisition ajoutées du Lot 2
-- Katoo acquise par Choco
('company', (SELECT id FROM companies WHERE name = 'Katoo'), 'company', (SELECT id FROM companies WHERE name = 'Choco'), 'acquise_par', 'Katoo est désormais intégrée à Choco (2021–2022).', NOW(), NOW()),

-- Tekyn acquise par Lectra
('company', (SELECT id FROM companies WHERE name = 'Tekyn'), 'company', (SELECT id FROM companies WHERE name = 'Lectra'), 'acquise_par', 'Lectra a pris le contrôle (compléments 2022–2023).', NOW(), NOW()),

-- Relations ajoutées du Lot 2.2
-- Otium Capital investit dans Orcan Energy
('company', (SELECT id FROM companies WHERE name = 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Orcan Energy'), 'investisseur', 'Entrée au capital annoncée le 31/01/2023.', NOW(), NOW()),

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
('personality', (SELECT id FROM personalities WHERE name = 'Bernard Arnault'), 'company', (SELECT id FROM companies WHERE name = 'Fondation Louis Vuitton'), 'fondateur', 'Commanditaire et président ; outil d''influence culturelle et soft power.', NOW(), NOW()),

-- Aglaé Ventures investit dans Back Market, Spotify, Slack, Airbnb
('company', (SELECT id FROM companies WHERE name = 'Aglaé Ventures'), 'company', (SELECT id FROM companies WHERE name = 'Back Market'), 'investisseur', 'Portefeuille Aglaé (site officiel).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Aglaé Ventures'), 'company', (SELECT id FROM companies WHERE name = 'Spotify'), 'investisseur', 'Portefeuille Aglaé (site officiel).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Aglaé Ventures'), 'company', (SELECT id FROM companies WHERE name = 'Slack'), 'investisseur', 'Portefeuille Aglaé (site officiel).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name = 'Aglaé Ventures'), 'company', (SELECT id FROM companies WHERE name = 'Airbnb'), 'investisseur', 'Portefeuille Aglaé (site officiel).', NOW(), NOW())

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
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, start_date, notes, "createdAt", "updatedAt") VALUES
-- GV invested in Owkin
('fund', (SELECT id FROM funds WHERE name = 'GV'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', NULL, 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- Bpifrance invested in Owkin
('fund', (SELECT id FROM funds WHERE name = 'Bpifrance'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', NULL, 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- F-Prime Capital invested in Owkin
('fund', (SELECT id FROM funds WHERE name = 'F-Prime Capital'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', NULL, 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- MACSF invested in Owkin
('fund', (SELECT id FROM funds WHERE name = 'MACSF'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', NULL, 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- Isai invested in Owkin
('fund', (SELECT id FROM funds WHERE name = 'Isai'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', NULL, 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- BioDiscovery 5 LP invested in Owkin
('fund', (SELECT id FROM funds WHERE name = 'BioDiscovery 5 LP'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', NULL, 'Co-investisseur dans les levées de fonds Owkin (montant non précisé)', NOW(), NOW()),

-- Bristol Myers Squibb invested in Owkin
('company', (SELECT id FROM companies WHERE name = 'Bristol Myers Squibb'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', NULL, 'Investisseur stratégique et partenaire pharmaceutique d''Owkin', NOW(), NOW()),

-- Sanofi invested in Owkin
('company', (SELECT id FROM companies WHERE name = 'Sanofi'), 'company', (SELECT id FROM companies WHERE name = 'Owkin'), 'invested_in', '2023-07-01', 'Investissement de 180 millions $ pour le partenariat stratégique en IA médicale', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 13. OTIUM CAPITAL → PLATEFORMES ROLL-UP
-- =====================================================

-- Otium Capital → plateformes (relation "plateforme_roll-up")
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Comet Software'), 'plateforme_roll-up', 'Plateforme business software portée par Otium Partners (livre blanc 12/2024).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Otelium'), 'plateforme_roll-up', 'Plateforme hôtelière (roll-up).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Alfeor'), 'plateforme_roll-up', 'Plateforme nucléaire (roll-up).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Enosium Life Science'), 'plateforme_roll-up', 'Plateforme services scientifiques santé (roll-up).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Novavet'), 'plateforme_roll-up', 'Plateforme santé animale (roll-up).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Hadrena'), 'plateforme_roll-up', 'Plateforme loisirs locaux (FEC).', NOW(), NOW())

ON CONFLICT (source_type, source_id, target_type, target_id, relation_type) DO NOTHING;

-- =====================================================
-- 14. OTIUM CAPITAL → OTIUM STUDIO
-- =====================================================

-- Otium Capital → Otium Studio (relation "studio")
INSERT INTO entity_relations (source_type, source_id, target_type, target_id, relation_type, notes, "createdAt", "updatedAt") VALUES
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Otium Studio'), 'studio', 'Startup studio intégré (budget >180 M€ jusqu''en 2030).', NOW(), NOW())

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
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'VSORA'), 'invested_in', 'Lead 46 M$ en 04/2025.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Orcan Energy'), 'invested_in', 'Entrée au capital annoncée le 31/01/2023.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Amenitiz'), 'invested_in', 'Lead seed 2019 ; participation Série A 2022.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Stage11'), 'invested_in', 'Seed 5 M€ menée par Otium (10/2021).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Rzilient'), 'invested_in', 'Participation tour early (2021–2023).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Metomic'), 'invested_in', 'Participation via Resonance (véhicule tech d''Otium).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Prello'), 'invested_in', 'Seed 13 M€ menée par Otium (02/2022).', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Aria'), 'invested_in', 'Série A 12/2023 aux côtés d''Adevinta Ventures.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'PayFit'), 'invested_in', 'Tour 2016 (co-mené avec Xavier Niel / NJJ) ; suivi 2019 via Frst.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Shippeo'), 'invested_in', 'Seed 2016 ; Série A 2017 avec Partech.', NOW(), NOW()),
('company', (SELECT id FROM companies WHERE name ILIKE 'Otium Capital'), 'company', (SELECT id FROM companies WHERE name = 'Otium Leisure'), 'invested_in', 'Financement 140 M€ (09/2024) pour construire un leader FEC.', NOW(), NOW())

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
