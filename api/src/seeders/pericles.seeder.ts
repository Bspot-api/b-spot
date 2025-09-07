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
      try {
        await em.persistAndFlush(sector);
        console.log(`✅ Created sector: ${name}`);
      } catch (error) {
        console.log(`   ⚠️  Sector ${name} already exists, skipping...`);
        sector = await em.findOne(Sector, { name });
      }
    }
    return sector;
  }

  private async createOrFindCompany(
    em: EntityManager,
    name: string,
    description: string,
    source: string,
    fund: Fund,
    sector: Sector,
    personality: Personality,
  ): Promise<Company> {
    let company = await em.findOne(Company, { name });
    if (!company) {
      company = new Company();
      company.name = name;
      company.description = description;
      company.source = source;
      company.published = true;
      company.fund = fund;
      company.sector = sector;
      company.personalities.add(personality);
      try {
        await em.persistAndFlush(company);
        console.log(`✅ Created company: ${name}`);
      } catch (error) {
        console.log(`   ⚠️  Company ${name} already exists, skipping...`);
        company = await em.findOne(Company, { name });
      }
    }
    return company;
  }

  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting Périclès seeding...');

    // Create or find the sector for political/think tank activities
    let politicalSector = await em.findOne(Sector, {
      name: 'Politique et Think Tank',
    });
    if (!politicalSector) {
      politicalSector = new Sector();
      politicalSector.name = 'Politique et Think Tank';
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
      try {
        await em.persistAndFlush(sterinPersonality);
        console.log('✅ Created Pierre-Édouard Stérin personality');
      } catch (error) {
        console.log(
          '   ⚠️  Pierre-Édouard Stérin personality already exists, skipping...',
        );
        sterinPersonality = await em.findOne(Personality, {
          name: 'Pierre-Édouard Stérin',
        });
      }
    }

    // Create links between entities
    console.log('🔗 Creating links between entities...');

    // Link entities safely
    try {
      // Link Otium Capital to Stérin personality
      otiumFund.personalities.add(sterinPersonality);
      console.log('   ✅ Linked Otium Capital to Stérin personality');

      // Link Stérin personality to Otium Capital
      sterinPersonality.funds.add(otiumFund);
      console.log('   ✅ Linked Stérin personality to Otium Capital');

      // Link Otium Capital to political sector
      otiumFund.sectors.add(politicalSector);
      console.log('   ✅ Linked Otium Capital to political sector');

      // Link political sector to Otium Capital
      politicalSector.funds.add(otiumFund);
      console.log('   ✅ Linked political sector to Otium Capital');
    } catch (error) {
      console.log('   ⚠️  Some links already exist, continuing...');
    }

    // Create Périclès company
    let periclesCompany = await em.findOne(Company, { name: 'Périclès' });
    if (!periclesCompany) {
      periclesCompany = new Company();
      periclesCompany.name = 'Périclès';
      periclesCompany.description =
        'Le projet Périclès (créé en 2023) est une initiative politique et métapolitique conçue pour promouvoir les valeurs identitaires, traditionalistes et conservatrices, et favoriser une alliance durable entre l’extrême droite et la droite libérale conservatrice. Il vise à infiltrer le débat public via les médias, les réseaux sociaux, la production audiovisuelle, les sondages, les influenceurs — afin de maîtriser la fenêtre d’Overton et « décrédibiliser les idées adverses ». Budget de 150 millions d’euros sur 10 ans, dont déjà une partie engagée';
      periclesCompany.source =
        'https://fr.wikipedia.org/wiki/Projet_P%C3%A9ricl%C3%A8s';
      periclesCompany.published = true;
      periclesCompany.fund = otiumFund;
      periclesCompany.sector = politicalSector;
      await em.persistAndFlush(periclesCompany);
      console.log('✅ Created Périclès company');
      console.log(`   📊 Linked to fund: ${otiumFund.name}`);
      console.log(`   🏭 Linked to sector: ${politicalSector.name}`);
    }

    // Link Périclès company to Stérin personality
    try {
      periclesCompany.personalities.add(sterinPersonality);
      await em.persistAndFlush(periclesCompany);
      console.log('✅ Linked Périclès company to Stérin personality');
    } catch (error) {
      console.log(
        '   ⚠️  Périclès already linked to personality, continuing...',
      );
    }

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
        description: 'Marque de lingerie et de vêtements de nuit',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Almé',
        description: 'Marque de vêtements et accessoires de mode',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Ana Luisa',
        description: 'Marque de bijoux et accessoires de mode',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Chnge',
        description: 'Marque de vêtements éco-responsables',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },

      // Éducation & Formation
      {
        name: 'Albert School',
        description: 'École de commerce et de management',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: educationSector,
      },
      {
        name: 'bestapeople',
        description: 'Plateforme de formation et développement personnel',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: educationSector,
      },

      // Technologie & Digital
      {
        name: '99digital',
        description: 'Agence digitale et marketing',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Alfeor',
        description: 'Plateforme technologique innovante',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Amenitiz',
        description: "Solution SaaS pour l'hôtellerie",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Animaj',
        description: "Studio d'animation et de création",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Aria',
        description: 'Plateforme de musique et streaming',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Arianee',
        description: 'Plateforme blockchain et NFT',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Altratech',
        description: 'Technologies alternatives et durables',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Aya',
        description: 'Application mobile et plateforme digitale',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Comet',
        description: 'Plateforme de collaboration et gestion de projet',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },

      // Santé & Bien-être
      {
        name: 'Ananda',
        description: 'Plateforme de bien-être et méditation',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Clay',
        description: 'Solution de santé mentale et bien-être',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },

      // Divertissement & Loisirs
      {
        name: 'Beat the bomb',
        description: 'Expérience de jeu immersif et interactif',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },

      // Alimentation & Nutrition
      {
        name: 'BeFC',
        description: "Solutions d'emballage alimentaire durable",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },
      {
        name: 'Caats',
        description: 'Nourriture pour animaux de compagnie',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },

      // Automobile & Transport
      {
        name: 'Carsell',
        description: 'Plateforme de vente de véhicules',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: automotiveSector,
      },

      // Santé & Médecine
      {
        name: 'DentalCo',
        description: 'Solutions dentaires et orthodontiques',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Dermae',
        description: 'Produits de soin de la peau',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Novavet',
        description: 'Médecine vétérinaire et soins animaux',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Nyxoah',
        description: 'Technologies médicales innovantes',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'Quantum Genomics',
        description: 'Recherche génomique et médecine personnalisée',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },

      // Beauté & Cosmétique
      {
        name: 'Dialect',
        description: 'Marque de cosmétiques et beauté',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Dossier',
        description: 'Marque de cosmétiques et soins',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Equivalenza',
        description: 'Cosmétiques et parfums de luxe',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },
      {
        name: 'Merci Handy',
        description: "Produits d'hygiène et soins personnels",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: fashionSector,
      },

      // Sport & Loisirs
      {
        name: 'Dynamo',
        description: 'Centre de sport et fitness',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Fort Boyard Aventures',
        description: "Parc d'aventures et loisirs",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Hapik',
        description: "Parc d'escalade et activités sportives",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Kids Empire',
        description: 'Parc de jeux pour enfants',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Kojump',
        description: 'Parc de trampolines et activités',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'SpeedPark',
        description: 'Parc de karting et sports motorisés',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Stage11',
        description: 'Plateforme de gaming et esport',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Terragame',
        description: 'Parc de jeux et divertissements',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Yumon',
        description: 'Parc de loisirs et attractions',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },

      // Alimentation & Restauration
      {
        name: 'Feed.',
        description: 'Plateforme de livraison de repas',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },
      {
        name: 'Féfé',
        description: 'Restaurant et cuisine gastronomique',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },
      {
        name: 'la Pataterie',
        description: 'Restaurant spécialisé dans les pommes de terre',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: foodSector,
      },

      // Cadeaux & Expériences
      {
        name: 'Giftory',
        description: 'Plateforme de cadeaux et expériences',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },
      {
        name: 'Smartbox',
        description: 'Coffrets cadeaux et expériences',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: entertainmentSector,
      },

      // Optique
      {
        name: 'Sym Optic',
        description: 'Optique et lunettes de vue',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },
      {
        name: 'SixtySixty',
        description: 'Marque de lunettes et optique',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: healthSector,
      },

      // Assurance & Services
      {
        name: 'Tuio',
        description: "Plateforme d'assurance et services financiers",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },

      // Technologie & Digital
      {
        name: 'E-peas',
        description: "Technologies d'énergie et IoT",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Enosium',
        description: 'Plateforme technologique innovante',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Ensol',
        description: 'Solutions énergétiques durables',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Fintool',
        description: 'Outils financiers et investissement',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'FJ Labs',
        description: "Laboratoire d'innovation technologique",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Flagcat',
        description: 'Plateforme de gestion et monitoring',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Hadrena',
        description: 'Solutions technologiques avancées',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Hani',
        description: 'Plateforme digitale et services',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Hyppo',
        description: 'Technologies mobiles et applications',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'IB2',
        description: "Solutions d'intelligence business",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'ISAI',
        description: "Fonds d'investissement technologique",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Jimmy',
        description: 'Plateforme de services et applications',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Join',
        description: 'Plateforme de connexion et networking',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Just',
        description: 'Solutions technologiques justes',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Katoo',
        description: 'Plateforme de restauration et livraison',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Kiliba',
        description: 'Technologies de gestion et organisation',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Lead Edge Capital',
        description: "Fonds d'investissement en capital-risque",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'LightOn',
        description: 'Intelligence artificielle et recherche',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Master Camp',
        description: 'Formation et développement des compétences',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: educationSector,
      },
      {
        name: 'MatX',
        description: 'Matériaux innovants et technologies',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Metomic',
        description: 'Sécurité des données et conformité',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Nebular',
        description: 'Technologies cloud et infrastructure',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Néolithe',
        description: 'Technologies environnementales et durables',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'One Pilot',
        description: 'Plateforme de pilotage et gestion',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Orcan',
        description: 'Solutions énergétiques renouvelables',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Otelium',
        description: 'Technologies hôtelières et touristiques',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Owkin',
        description: 'Intelligence artificielle en santé',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'OXP',
        description: "Plateforme d'expérience utilisateur",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Payfit',
        description: 'Solution de paie et ressources humaines',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Piloc',
        description: 'Plateforme de localisation et navigation',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Prello',
        description: 'Plateforme de voyage et hébergement',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Proov Station',
        description: 'Stations de recharge et mobilité',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Prosper',
        description: 'Plateforme de financement et investissement',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Quinten',
        description: 'Solutions de trading et investissement',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Raise Seed for good',
        description: 'Plateforme de financement solidaire',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Revibe',
        description: 'Plateforme de musique et découverte',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Rzilient',
        description: 'Solutions de résilience et continuité',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Shippeo',
        description: 'Plateforme de suivi logistique',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Silvr',
        description: 'Solutions de paiement et fintech',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'TechLife Capital',
        description: "Fonds d'investissement en technologies",
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Tekyn',
        description: 'Technologies textiles et mode',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'The Oasis House',
        description: 'Plateforme de bien-être et lifestyle',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'The Refiners',
        description: 'Solutions de raffinage et optimisation',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Tomorro',
        description: 'Plateforme de planification et organisation',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'VSORA',
        description: 'Technologies de vision et reconnaissance',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
      {
        name: 'Zeliq',
        description: 'Plateforme de liquidité et trading',
        source: 'https://www.instagram.com/p/DLejL_eioIV/',
        sector: techSector,
      },
    ];

    for (const companyData of companies) {
      await this.createOrFindCompany(
        em,
        companyData.name,
        companyData.description,
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
