-- =====================================================
-- PERSONALITIES SEEDER
-- =====================================================
-- Creates all personalities (business leaders, entrepreneurs, media figures)
-- Uses UPSERT pattern (INSERT ... ON CONFLICT ... DO UPDATE)

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
