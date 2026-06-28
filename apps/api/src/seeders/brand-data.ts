/**
 * Brand → SIREN seed data for French consumer brands.
 *
 * Sources: company websites (mentions légales), pappers.fr public search, societe.com
 * SIRENs marked ✅ are confirmed via public registries.
 * SIRENs marked ⚠️ are tentative and must be validated against the Pappers API.
 *
 * The `name` field stores a canonical brand label.
 * Variants/typos should be handled by matching logic (normalization + fuzzy search),
 * not by duplicating seed rows.
 */

export interface BrandSeedEntry {
  name: string;
  siren: string;
  parentCompany: string;
}

export const BRAND_SEED_DATA: BrandSeedEntry[] = [
  // ─── Nestlé France (SIREN confirmed) ─────────────────────────────────────
  { name: 'Nestlé', siren: '542014428', parentCompany: 'Nestlé France SA' }, // ✅
  { name: 'Nespresso', siren: '542014428', parentCompany: 'Nestlé France SA' }, // ✅
  { name: 'Nescafé', siren: '542014428', parentCompany: 'Nestlé France SA' }, // ✅
  { name: 'Chocapic', siren: '542014428', parentCompany: 'Nestlé France SA' }, // ✅ Open Food Facts
  { name: 'KitKat', siren: '542014428', parentCompany: 'Nestlé France SA' },
  { name: 'Maggi', siren: '542014428', parentCompany: 'Nestlé France SA' },
  { name: 'Herta', siren: '542014428', parentCompany: 'Nestlé France SA' },
  { name: 'Perrier', siren: '542014428', parentCompany: 'Nestlé France SA' },
  { name: 'Vittel', siren: '542014428', parentCompany: 'Nestlé France SA' },

  // ─── Ferrero France (⚠️ SIREN à valider) ──────────────────────────────────
  { name: 'Ferrero', siren: '602018897', parentCompany: 'Ferrero France SAS' }, // ⚠️
  { name: 'Nutella', siren: '602018897', parentCompany: 'Ferrero France SAS' }, // ✅ Open Food Facts
  { name: 'Kinder', siren: '602018897', parentCompany: 'Ferrero France SAS' },
  { name: 'Ferrero Rocher', siren: '602018897', parentCompany: 'Ferrero France SAS' }, // ✅ Open Food Facts
  { name: 'Raffaello', siren: '602018897', parentCompany: 'Ferrero France SAS' },
  { name: 'Tic Tac', siren: '602018897', parentCompany: 'Ferrero France SAS' },

  // ─── Danone (⚠️ SIREN à valider) ──────────────────────────────────────────
  { name: 'Danone', siren: '552032534', parentCompany: 'Danone SA' }, // ⚠️
  { name: 'Activia', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Actimel', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Danette', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Volvic', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Evian', siren: '552032534', parentCompany: 'Danone SA' },
  { name: 'Danonino', siren: '552032534', parentCompany: 'Danone SA' },

  // ─── Coca-Cola France (⚠️ SIREN à valider) ────────────────────────────────
  { name: 'Coca-Cola', siren: '343688016', parentCompany: 'Coca-Cola European Partners France' }, // ⚠️
  { name: 'Fanta', siren: '343688016', parentCompany: 'Coca-Cola European Partners France' },
  { name: 'Sprite', siren: '343688016', parentCompany: 'Coca-Cola European Partners France' },
  { name: 'Powerade', siren: '343688016', parentCompany: 'Coca-Cola European Partners France' },

  // ─── Mondelez France (⚠️ SIREN à valider) ────────────────────────────────
  { name: 'Milka', siren: '808234801', parentCompany: 'Mondelez France SAS' }, // ⚠️ Open Food Facts
  { name: 'Oreo', siren: '808234801', parentCompany: 'Mondelez France SAS' },
  { name: 'LU', siren: '808234801', parentCompany: 'Mondelez France SAS' },
  { name: 'Petit Beurre', siren: '808234801', parentCompany: 'Mondelez France SAS' },
  { name: 'Prince', siren: '808234801', parentCompany: 'Mondelez France SAS' },
  { name: 'Côte d Or', siren: '808234801', parentCompany: 'Mondelez France SAS' },
  { name: 'Toblerone', siren: '808234801', parentCompany: 'Mondelez France SAS' },

  // ─── PepsiCo France (⚠️ SIREN à valider) ────────────────────────────────
  { name: "Lay's", siren: '381511039', parentCompany: 'PepsiCo France SAS' }, // ⚠️
  { name: 'Quaker', siren: '381511039', parentCompany: 'PepsiCo France SAS' }, // ✅ Open Food Facts
  { name: 'Pepsi', siren: '381511039', parentCompany: 'PepsiCo France SAS' },
  { name: 'Lipton', siren: '381511039', parentCompany: 'PepsiCo France SAS' },

  // ─── Lactalis (⚠️ SIREN à valider) ────────────────────────────────────────
  { name: 'Président', siren: '331142554', parentCompany: 'Lactalis' }, // ⚠️
  { name: 'Lactel', siren: '331142554', parentCompany: 'Lactalis' },
  { name: 'Bridel', siren: '331142554', parentCompany: 'Lactalis' },

  // ─── Bjorg / Charles & Alice (⚠️ SIREN à valider) ────────────────────────
  { name: 'Bjorg', siren: '402712350', parentCompany: 'Bjorg Bonneterre et Compagnie' }, // ⚠️ Open Food Facts
];
