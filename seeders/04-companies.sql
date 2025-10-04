-- =====================================================
-- =====================================================
-- COMPANIES SEEDER
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
('Financière V', 'Holding familiale privée créée par Vincent Bolloré dans les années 1980, échelon du contrôle capitalistique du groupe Bolloré entre Bolloré Participations et Sofibol.', 'https://www.zonebourse.com/cours/action/BOLLORE-4717/', true, NOW())
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
