/**
 * Brand → SIREN seed data for French consumer brands.
 *
 * Sources: company websites (mentions légales), pappers.fr public search, societe.com
 * SIRENs marked ✅ are confirmed via public registries.
 * SIRENs marked ⚠️ are tentative and must be validated against the Pappers API.
 *
 * The `name` field must match (case-insensitively) the `brands` field from Open Food Facts.
 */

export interface BrandSeedEntry {
  name: string;
  siren: string;
  parentCompany: string;
}

export const BRAND_SEED_DATA: BrandSeedEntry[] = [
  // ─── Nestlé France (SIREN confirmed) ─────────────────────────────────────
  { name: 'Nestlé', siren: '552108011', parentCompany: 'Nestlé France SA' }, // ✅
  { name: 'Nestle', siren: '552108011', parentCompany: 'Nestlé France SA' }, // alias sans accent
  { name: 'Nespresso', siren: '552108011', parentCompany: 'Nestlé France SA' }, // ✅
  { name: 'Nescafé', siren: '552108011', parentCompany: 'Nestlé France SA' }, // ✅
  { name: 'Nescafe', siren: '552108011', parentCompany: 'Nestlé France SA' },
  { name: 'Chocapic', siren: '552108011', parentCompany: 'Nestlé France SA' }, // ✅ Open Food Facts
  { name: 'KitKat', siren: '552108011', parentCompany: 'Nestlé France SA' },
  { name: 'Kit Kat', siren: '552108011', parentCompany: 'Nestlé France SA' },
  { name: 'Maggi', siren: '552108011', parentCompany: 'Nestlé France SA' },
  { name: 'Herta', siren: '552108011', parentCompany: 'Nestlé France SA' },
  { name: 'Perrier', siren: '552108011', parentCompany: 'Nestlé France SA' },
  { name: 'Vittel', siren: '552108011', parentCompany: 'Nestlé France SA' },

  // ─── Ferrero France (⚠️ SIREN à valider) ──────────────────────────────────
  { name: 'Ferrero', siren: '303543440', parentCompany: 'Ferrero France SAS' }, // ⚠️
  { name: 'Nutella', siren: '303543440', parentCompany: 'Ferrero France SAS' }, // ✅ Open Food Facts
  { name: 'Kinder', siren: '303543440', parentCompany: 'Ferrero France SAS' },
  { name: 'Ferrero Rocher', siren: '303543440', parentCompany: 'Ferrero France SAS' }, // ✅ Open Food Facts
  { name: 'Raffaello', siren: '303543440', parentCompany: 'Ferrero France SAS' },
  { name: 'Tic Tac', siren: '303543440', parentCompany: 'Ferrero France SAS' },

  // ─── Danone (⚠️ SIREN à valider) ──────────────────────────────────────────
  { name: 'Danone', siren: '552032534', parentCompany: 'Danone SA' }, // ⚠️
  { name: 'Activia', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Actimel', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Danette', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Volvic', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Evian', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Danonino', siren: '552032534', parentCompany: 'Danone SA' },

  // ─── Coca-Cola France (⚠️ SIREN à valider) ────────────────────────────────
  { name: 'Coca-Cola', siren: '562126525', parentCompany: 'Coca-Cola European Partners France' }, // ⚠️
  { name: 'Coca Cola', siren: '562126525', parentCompany: 'Coca-Cola European Partners France' },
  { name: 'Fanta', siren: '562126525', parentCompany: 'Coca-Cola European Partners France' },
  { name: 'Sprite', siren: '562126525', parentCompany: 'Coca-Cola European Partners France' },
  { name: 'Powerade', siren: '562126525', parentCompany: 'Coca-Cola European Partners France' },

  // ─── Mondelez France (⚠️ SIREN à valider) ────────────────────────────────
  { name: 'Milka', siren: '412461264', parentCompany: 'Mondelez France SAS' }, // ⚠️ Open Food Facts
  { name: 'Oreo', siren: '412461264', parentCompany: 'Mondelez France SAS' },
  { name: 'LU', siren: '412461264', parentCompany: 'Mondelez France SAS' },
  { name: 'Petit Beurre', siren: '412461264', parentCompany: 'Mondelez France SAS' },
  { name: 'Prince', siren: '412461264', parentCompany: 'Mondelez France SAS' },
  { name: 'Côte d Or', siren: '412461264', parentCompany: 'Mondelez France SAS' },
  { name: 'Toblerone', siren: '412461264', parentCompany: 'Mondelez France SAS' },

  // ─── PepsiCo France (⚠️ SIREN à valider) ────────────────────────────────
  { name: "Lay's", siren: '309725545', parentCompany: 'PepsiCo France SAS' }, // ⚠️
  { name: 'Lays', siren: '309725545', parentCompany: 'PepsiCo France SAS' },
  { name: 'Quaker', siren: '309725545', parentCompany: 'PepsiCo France SAS' }, // ✅ Open Food Facts
  { name: 'Pepsi', siren: '309725545', parentCompany: 'PepsiCo France SAS' },
  { name: 'Lipton', siren: '309725545', parentCompany: 'PepsiCo France SAS' },

  // ─── Lactalis (⚠️ SIREN à valider) ────────────────────────────────────────
  { name: 'Président', siren: '699800346', parentCompany: 'Lactalis' }, // ⚠️
  { name: 'President', siren: '699800346', parentCompany: 'Lactalis' },
  { name: 'Lactel', siren: '699800346', parentCompany: 'Lactalis' },
  { name: 'Bridel', siren: '699800346', parentCompany: 'Lactalis' },

  // ─── Bjorg / Charles & Alice (⚠️ SIREN à valider) ────────────────────────
  { name: 'Bjorg', siren: '399360382', parentCompany: 'Bjorg Bonneterre et Compagnie' }, // ⚠️ Open Food Facts
];
