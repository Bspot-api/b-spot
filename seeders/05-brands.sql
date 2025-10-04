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
