-- =====================================================
-- FUNDS SEEDER
-- =====================================================
-- Creates investment funds, holdings and family offices
-- Uses UPSERT pattern (INSERT ... ON CONFLICT ... DO UPDATE)

INSERT INTO funds (name, description, published, "createdAt") VALUES
('Otium Capital', 'Holding d''investissement privée/family office fondée en 2009 par Pierre-Édouard Stérin. AUM ~1,7 Md€ ; IRR 25% (depuis 2015) ; >130 sociétés soutenues. CEO : François Durvye. 190 M€ investis en 2023, objectif 300 M€ en 2024.', true, NOW()),
-- Fonds Bolloré
('Vivendi', 'Conglomérat français de médias et de communication contrôlé par le groupe Bolloré. Actionnaire majoritaire de Canal+, Havas, et autres actifs médias.', true, NOW()),
('Groupe Bolloré', 'Conglomérat français contrôlé par la famille Bolloré. Actionnaire de référence de Vivendi et de diverses entreprises industrielles et médiatiques.', true, NOW()),
-- Fonds Arnault
('Groupe Arnault (Agache)', 'Holding familiale des Arnault (Agache), détient ~97% de Christian Dior SE. La famille Arnault totalise ~48% capital / ~64% droits de vote LVMH.', true, NOW()),
-- Co-investisseurs Owkin
('Bpifrance', 'Banque publique d''investissement française (fonds large venture + digital venture).', true, NOW()),
('Isai', 'Fonds VC français créé par les fondateurs de Free/Iliad, investisseur early-stage tech.', true, NOW()),
('BioDiscovery 5 LP', 'Fonds d''investissement spécialisé biotech/sciences de la vie.', true, NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  published = EXCLUDED.published;
