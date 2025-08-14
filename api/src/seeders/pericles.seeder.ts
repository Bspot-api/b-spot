import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Company } from '../modules/company/company.entity';
import { Fund } from '../modules/fund/fund.entity';
import { Personality } from '../modules/personality/personality.entity';
import { Sector } from '../modules/sector/sector.entity';

export class PericlesSeeder extends Seeder {
  private async createOrFindSector(
    em: EntityManager,
    name: string,
    description: string,
  ): Promise<Sector> {
    let sector = await em.findOne(Sector, { name });
    if (!sector) {
      sector = new Sector();
      sector.name = name;
      sector.description = description;
      sector.published = true;
      await em.persistAndFlush(sector);
      console.log(`✅ Created sector: ${name}`);
    }
    return sector;
  }

  private async createOrFindCompany(
    em: EntityManager,
    name: string,
    source: string,
    fund: Fund,
    sector: Sector,
    personality: Personality,
  ): Promise<Company> {
    let company = await em.findOne(Company, { name });
    if (!company) {
      company = new Company();
      company.name = name;
      company.source = source;
      company.published = true;
      company.fund = fund;
      company.sector = sector;
      company.personalities.add(personality);
      await em.persistAndFlush(company);
      console.log(`✅ Created company: ${name}`);
    }
    return company;
  }

  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting Périclès seeding...');

    // Create or find the sector for political/think tank activities
    let politicalSector = await em.findOne(Sector, {
      name: 'Politique & Think Tank',
    });
    if (!politicalSector) {
      politicalSector = new Sector();
      politicalSector.name = 'Politique & Think Tank';
      politicalSector.description =
        'Secteur politique et organisations de réflexion';
      politicalSector.published = true;
      await em.persistAndFlush(politicalSector);
      console.log('✅ Created political sector');
    }

    // Create or find Otium Capital fund
    let otiumFund = await em.findOne(Fund, { name: 'Otium Capital' });
    if (!otiumFund) {
      otiumFund = new Fund();
      otiumFund.name = 'Otium Capital';
      otiumFund.description =
        "Holding d'investissements privée créée en 2009 par Pierre-Édouard Stérin, spécialisée dans l'industrie, loisirs, immobilier, santé, consumer et Tech. 1,7 Md€ d'actifs, 255 M€ déployés en 2024.";
      otiumFund.published = true;
      await em.persistAndFlush(otiumFund);
      console.log('✅ Created Otium Capital fund');
    }

    // Create or find Pierre-Édouard Stérin personality
    let sterinPersonality = await em.findOne(Personality, {
      name: 'Pierre-Édouard Stérin',
    });
    if (!sterinPersonality) {
      sterinPersonality = new Personality();
      sterinPersonality.name = 'Pierre-Édouard Stérin';
      sterinPersonality.description =
        'Milliardaire français, fondateur et architecte du projet Périclès, visant à promouvoir des valeurs conservatrices et influencer la politique française';
      sterinPersonality.published = true;
      await em.persistAndFlush(sterinPersonality);
      console.log('✅ Created Pierre-Édouard Stérin personality');
    }

    // Create links between entities
    console.log('🔗 Creating links between entities...');

    // Link Otium Capital to Stérin personality
    otiumFund.personalities.add(sterinPersonality);
    console.log('   ✅ Linked Otium Capital to Stérin personality');

    // Link Stérin personality to Otium Capital
    sterinPersonality.funds.add(otiumFund);
    console.log('   ✅ Linked Stérin personality to Otium Capital');

    // Link Otium Capital to political sector (as it's also in the political/investment sphere)
    otiumFund.sectors.add(politicalSector);
    console.log('   ✅ Linked Otium Capital to political sector');

    // Link political sector to Otium Capital
    politicalSector.funds.add(otiumFund);
    console.log('   ✅ Linked political sector to Otium Capital');

    // Create Périclès company
    let periclesCompany = await em.findOne(Company, { name: 'Périclès' });
    if (!periclesCompany) {
      periclesCompany = new Company();
      periclesCompany.name = 'Périclès';
      periclesCompany.source =
        'https://fr.wikipedia.org/wiki/Projet_P%C3%A9ricl%C3%A8s';
      periclesCompany.published = true;
      periclesCompany.fund = otiumFund;
      periclesCompany.sector = politicalSector;
      await em.persistAndFlush(periclesCompany);
      console.log('✅ Created Périclès company');
    }

    // Link Périclès company to Stérin personality
    periclesCompany.personalities.add(sterinPersonality);
    await em.persistAndFlush(periclesCompany);
    console.log('✅ Linked Périclès company to Stérin personality');

    // Create additional sectors
    console.log('🏭 Creating additional sectors...');
    const fashionSector = await this.createOrFindSector(
      em,
      'Mode & Textile',
      'Secteur de la mode, du textile et de la bijouterie',
    );
    const educationSector = await this.createOrFindSector(
      em,
      'Éducation & Formation',
      "Secteur de l'éducation, des écoles et de la formation en ligne",
    );
    const techSector = await this.createOrFindSector(
      em,
      'Technologie & Digital',
      'Secteur des technologies, plateformes digitales et logiciels',
    );
    const healthSector = await this.createOrFindSector(
      em,
      'Santé & Bien-être',
      'Secteur de la santé, bien-être et santé mentale',
    );
    const entertainmentSector = await this.createOrFindSector(
      em,
      'Divertissement & Loisirs',
      'Secteur du divertissement, jeux et loisirs',
    );
    const foodSector = await this.createOrFindSector(
      em,
      'Alimentation & Nutrition',
      "Secteur de l'alimentation, nutrition et nourriture pour animaux",
    );
    const automotiveSector = await this.createOrFindSector(
      em,
      'Automobile & Transport',
      'Secteur automobile et transport',
    );

    // Create companies
    console.log('🏢 Creating companies...');
    const companies = [
      // Mode & Textile
      {
        name: 'Adore Me',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Almé',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Ana Luisa',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Chnge',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },

      // Éducation & Formation
      {
        name: 'Albert School',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: educationSector,
      },
      {
        name: 'bestapeople',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: educationSector,
      },

      // Technologie & Digital
      {
        name: '99digital',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Alfeor',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Amenitiz',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Animaj',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Aria',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Arianee',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Altratech',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Aya',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Comet',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },

      // Santé & Bien-être
      {
        name: 'Ananda',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Clay',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },

      // Divertissement & Loisirs
      {
        name: 'Beat the bomb',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },

      // Alimentation & Nutrition
      {
        name: 'BeFC',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },
      {
        name: 'Caats',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },

      // Automobile & Transport
      {
        name: 'Carsell',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: automotiveSector,
      },

      // Santé & Médecine
      {
        name: 'DentalCo',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Dermae',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Novavet',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Nyxoah',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Quantum Genomics',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },

      // Beauté & Cosmétique
      {
        name: 'Dialect',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Dossier',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Equivalenza',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Merci Handy',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },

      // Sport & Loisirs
      {
        name: 'Dynamo',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Fort Boyard Aventures',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Hapik',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Kids Empire',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Kojump',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'SpeedPark',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Stage11',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Terragame',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Yumon',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },

      // Alimentation & Restauration
      {
        name: 'Feed.',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },
      {
        name: 'Féfé',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },
      {
        name: 'la Pataterie',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },

      // Cadeaux & Expériences
      {
        name: 'Giftory',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Smartbox',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },

      // Optique
      {
        name: 'Sym Optic',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'SixtySixty',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },

      // Assurance & Services
      {
        name: 'Tuio',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },

      // Technologie & Digital
      {
        name: 'E-peas',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Enosium',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Ensol',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Fintool',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'FJ Labs',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Flagcat',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Hadrena',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Hani',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Hyppo',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'IB2',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'ISAI',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Jimmy',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Join',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Just',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Katoo',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Kiliba',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Lead Edge Capital',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'LightOn',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Master Camp',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: educationSector,
      },
      {
        name: 'MatX',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Metomic',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Nebular',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Néolithe',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'One Pilot',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Orcan',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Otelium',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Owkin',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'OXP',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Payfit',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Piloc',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Prello',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Proov Station',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Prosper',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Quinten',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Raise Seed for good',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Revibe',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Rzilient',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Shippeo',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Silvr',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'TechLife Capital',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Tekyn',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'The Oasis House',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'The Refiners',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Tomorro',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'VSORA',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Zeliq',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
    ];

    for (const companyData of companies) {
      await this.createOrFindCompany(
        em,
        companyData.name,
        companyData.source,
        otiumFund,
        companyData.sector,
        sterinPersonality,
      );
    }

    // Persist all changes
    await em.persistAndFlush([
      otiumFund,
      sterinPersonality,
      politicalSector,
      periclesCompany,
      fashionSector,
      educationSector,
      techSector,
      healthSector,
      entertainmentSector,
      foodSector,
      automotiveSector,
    ]);

    console.log('✅ Périclès seeding completed with all links!');
  }
}
