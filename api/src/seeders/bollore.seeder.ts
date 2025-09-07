import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Company } from '../modules/company/company.entity';
import { Fund } from '../modules/fund/fund.entity';
import { Personality } from '../modules/personality/personality.entity';
import { Sector } from '../modules/sector/sector.entity';

export class BolloreSeeder extends Seeder {
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
    console.log('🌱 Starting Bolloré seeding...');

    // Create or find the sector for media and holding activities
    let mediaSector = await em.findOne(Sector, {
      name: 'Médias & Communication',
    });
    if (!mediaSector) {
      mediaSector = new Sector();
      mediaSector.name = 'Médias & Communication';
      mediaSector.description =
        'Secteur des médias, télévision, radio, presse et communication';
      mediaSector.published = true;
      await em.persistAndFlush(mediaSector);
      console.log('✅ Created media sector');
    }

    let holdingSector = await em.findOne(Sector, {
      name: 'Holdings & Investissement',
    });
    if (!holdingSector) {
      holdingSector = new Sector();
      holdingSector.name = 'Holdings & Investissement';
      holdingSector.description =
        "Secteur des holdings et sociétés d'investissement";
      holdingSector.published = true;
      await em.persistAndFlush(holdingSector);
      console.log('✅ Created holding sector');
    }

    // Create or find Vivendi fund
    let vivendiFund = await em.findOne(Fund, { name: 'Vivendi' });
    if (!vivendiFund) {
      vivendiFund = new Fund();
      vivendiFund.name = 'Vivendi';
      vivendiFund.description =
        'Conglomérat français de médias et de communication contrôlé par le groupe Bolloré. Actionnaire majoritaire de Canal+, Havas, et autres actifs médias.';
      vivendiFund.published = true;
      await em.persistAndFlush(vivendiFund);
      console.log('✅ Created Vivendi fund');
    }

    // Create or find Bolloré Group fund
    let bolloreFund = await em.findOne(Fund, { name: 'Groupe Bolloré' });
    if (!bolloreFund) {
      bolloreFund = new Fund();
      bolloreFund.name = 'Groupe Bolloré';
      bolloreFund.description =
        'Conglomérat français contrôlé par la famille Bolloré. Actionnaire de référence de Vivendi et de diverses entreprises industrielles et médiatiques.';
      bolloreFund.published = true;
      await em.persistAndFlush(bolloreFund);
      console.log('✅ Created Bolloré Group fund');
    }

    // Create or find Vincent Bolloré personality
    let vincentBollorePersonality = await em.findOne(Personality, {
      name: 'Vincent Bolloré',
    });
    if (!vincentBollorePersonality) {
      vincentBollorePersonality = new Personality();
      vincentBollorePersonality.name = 'Vincent Bolloré';
      vincentBollorePersonality.description =
        'Milliardaire français, président et actionnaire de contrôle du groupe Bolloré, influence majeure sur les médias français via Vivendi';
      vincentBollorePersonality.published = true;
      try {
        await em.persistAndFlush(vincentBollorePersonality);
        console.log('✅ Created Vincent Bolloré personality');
      } catch (error) {
        console.log(
          '   ⚠️  Vincent Bolloré personality already exists, skipping...',
        );
        vincentBollorePersonality = await em.findOne(Personality, {
          name: 'Vincent Bolloré',
        });
      }
    }

    // Create or find Yannick Bolloré personality
    let yannickBollorePersonality = await em.findOne(Personality, {
      name: 'Yannick Bolloré',
    });
    if (!yannickBollorePersonality) {
      yannickBollorePersonality = new Personality();
      yannickBollorePersonality.name = 'Yannick Bolloré';
      yannickBollorePersonality.description =
        'Président du conseil de surveillance de Vivendi et PDG de Havas, fils de Vincent Bolloré';
      yannickBollorePersonality.published = true;
      try {
        await em.persistAndFlush(yannickBollorePersonality);
        console.log('✅ Created Yannick Bolloré personality');
      } catch (error) {
        console.log(
          '   ⚠️  Yannick Bolloré personality already exists, skipping...',
        );
        yannickBollorePersonality = await em.findOne(Personality, {
          name: 'Yannick Bolloré',
        });
      }
    }

    // Create or find Maxime Saada personality
    let maximeSaadaPersonality = await em.findOne(Personality, {
      name: 'Maxime Saada',
    });
    if (!maximeSaadaPersonality) {
      maximeSaadaPersonality = new Personality();
      maximeSaadaPersonality.name = 'Maxime Saada';
      maximeSaadaPersonality.description =
        'PDG du Groupe Canal+ et Président de Studiocanal, figure majeure de la télévision payante française';
      maximeSaadaPersonality.published = true;
      try {
        await em.persistAndFlush(maximeSaadaPersonality);
        console.log('✅ Created Maxime Saada personality');
      } catch (error) {
        console.log(
          '   ⚠️  Maxime Saada personality already exists, skipping...',
        );
        maximeSaadaPersonality = await em.findOne(Personality, {
          name: 'Maxime Saada',
        });
      }
    }

    // Create links between entities
    console.log('🔗 Creating links between entities...');

    // Link entities safely
    try {
      // Link Vivendi fund to Vincent Bolloré personality
      vivendiFund.personalities.add(vincentBollorePersonality);
      console.log('   ✅ Linked Vivendi to Vincent Bolloré personality');

      // Link Vincent Bolloré personality to Vivendi fund
      vincentBollorePersonality.funds.add(vivendiFund);
      console.log('   ✅ Linked Vincent Bolloré personality to Vivendi');

      // Link Vivendi fund to media sector
      vivendiFund.sectors.add(mediaSector);
      console.log('   ✅ Linked Vivendi to media sector');

      // Link media sector to Vivendi fund
      mediaSector.funds.add(vivendiFund);
      console.log('   ✅ Linked media sector to Vivendi');

      // Link Bolloré Group to Vincent Bolloré and holding sector
      bolloreFund.personalities.add(vincentBollorePersonality);
      vincentBollorePersonality.funds.add(bolloreFund);
      bolloreFund.sectors.add(holdingSector);
      holdingSector.funds.add(bolloreFund);
      console.log(
        '   ✅ Linked Bolloré Group to Vincent Bolloré and holding sector',
      );
    } catch (error) {
      console.log('   ⚠️  Some links already exist, continuing...');
    }

    // Create Vivendi SE company
    let vivendiCompany = await em.findOne(Company, { name: 'Vivendi SE' });
    if (!vivendiCompany) {
      vivendiCompany = new Company();
      vivendiCompany.name = 'Vivendi SE';
      vivendiCompany.description =
        'Conglomérat français de médias et de communication, contrôlé par le groupe Bolloré. Propriétaire de Canal+, Havas, et autres actifs médiatiques majeurs.';
      vivendiCompany.source = 'https://www.vivendi.com';
      vivendiCompany.published = true;
      vivendiCompany.fund = bolloreFund;
      vivendiCompany.sector = holdingSector;
      await em.persistAndFlush(vivendiCompany);
      console.log('✅ Created Vivendi SE company');
      console.log(`   📊 Linked to fund: ${bolloreFund.name}`);
      console.log(`   🏭 Linked to sector: ${holdingSector.name}`);
    }

    // Link Vivendi SE company to Vincent Bolloré personality
    try {
      vivendiCompany.personalities.add(vincentBollorePersonality);
      await em.persistAndFlush(vivendiCompany);
      console.log(
        '✅ Linked Vivendi SE company to Vincent Bolloré personality',
      );
    } catch (error) {
      console.log(
        '   ⚠️  Vivendi SE already linked to personality, continuing...',
      );
    }

    // Create additional sectors
    console.log('🏭 Creating additional sectors...');
    const televisionSector = await this.createOrFindSector(
      em,
      'Télévision & Audiovisuel',
      'Secteur de la télévision, chaînes et production audiovisuelle',
    );
    const radioSector = await this.createOrFindSector(
      em,
      'Radio & Audio',
      'Secteur de la radio et contenus audio',
    );
    const advertisingSector = await this.createOrFindSector(
      em,
      'Publicité & Marketing',
      'Secteur de la publicité, marketing et communication',
    );
    const cinemaSector = await this.createOrFindSector(
      em,
      'Cinéma & Production',
      'Secteur du cinéma et de la production audiovisuelle',
    );
    const publishingSector = await this.createOrFindSector(
      em,
      'Presse & Edition',
      'Secteur de la presse, édition et médias écrits',
    );
    const gamingSector = await this.createOrFindSector(
      em,
      'Jeux Vidéo & Gaming',
      'Secteur des jeux vidéo et du gaming',
    );
    const streamingSector = await this.createOrFindSector(
      em,
      'Streaming & Digital',
      'Secteur du streaming et plateformes digitales',
    );

    // Create companies
    console.log('🏢 Creating companies...');
    const companies = [
      // Télévision & Audiovisuel
      {
        name: 'Canal+ Group',
        description:
          "Groupe de télévision à péage français, diffuseur premium et producteur de contenus, fleuron de l'empire médiatique de Vivendi",
        source: 'https://www.canalplusgroup.com',
        sector: televisionSector,
        personality: maximeSaadaPersonality,
      },
      {
        name: 'CNews',
        description:
          "Chaîne de télévision française d'information en continu, appartenant au Groupe Canal+",
        source: 'https://www.cnews.fr',
        sector: televisionSector,
        personality: vincentBollorePersonality,
      },
      {
        name: 'C8',
        description:
          'Chaîne de télévision généraliste française, appartenant au Groupe Canal+',
        source: 'https://www.c8.fr',
        sector: televisionSector,
        personality: vincentBollorePersonality,
      },

      // Radio & Audio
      {
        name: 'Europe 1',
        description:
          'Station de radio généraliste française, appartenant à Lagardère (participation Vivendi)',
        source: 'https://www.europe1.fr',
        sector: radioSector,
        personality: vincentBollorePersonality,
      },

      // Publicité & Marketing
      {
        name: 'Havas',
        description:
          'Groupe français de communication et publicité, sixième groupe mondial, propriété de Vivendi',
        source: 'https://www.havas.com',
        sector: advertisingSector,
        personality: yannickBollorePersonality,
      },

      // Cinéma & Production
      {
        name: 'Studiocanal',
        description:
          'Société française de production et distribution cinématographique, filiale du Groupe Canal+',
        source: 'https://www.studiocanal.com',
        sector: cinemaSector,
        personality: maximeSaadaPersonality,
      },

      // Presse & Edition
      {
        name: 'Prisma Media',
        description:
          "Groupe français d'édition de magazines, propriété de Vivendi",
        source: 'https://www.prismamedia.com',
        sector: publishingSector,
        personality: vincentBollorePersonality,
      },
      {
        name: 'Le Journal du Dimanche',
        description:
          "Hebdomadaire français d'information, appartenant au groupe Lagardère (participation Vivendi)",
        source: 'https://www.lejdd.fr',
        sector: publishingSector,
        personality: vincentBollorePersonality,
      },

      // Jeux Vidéo & Gaming
      {
        name: 'Gameloft',
        description:
          'Éditeur et développeur français de jeux vidéo mobile, filiale de Vivendi',
        source: 'https://www.gameloft.com',
        sector: gamingSector,
        personality: vincentBollorePersonality,
      },

      // Streaming & Digital
      {
        name: 'Dailymotion',
        description:
          "Plateforme française d'hébergement et de partage de vidéos, propriété de Vivendi",
        source: 'https://www.dailymotion.com',
        sector: streamingSector,
        personality: maximeSaadaPersonality,
      },

      // Holdings & Investissement
      {
        name: 'Bolloré SE',
        description:
          "Société d'investissement et holding industriel français contrôlé par Vincent Bolloré",
        source: 'https://www.bollore.com',
        sector: holdingSector,
        personality: vincentBollorePersonality,
      },
    ];

    for (const companyData of companies) {
      await this.createOrFindCompany(
        em,
        companyData.name,
        companyData.description,
        companyData.source,
        vivendiFund,
        companyData.sector,
        companyData.personality,
      );
    }

    // Persist all changes
    await em.persistAndFlush([
      vivendiFund,
      bolloreFund,
      vincentBollorePersonality,
      yannickBollorePersonality,
      maximeSaadaPersonality,
      mediaSector,
      holdingSector,
      televisionSector,
      radioSector,
      advertisingSector,
      cinemaSector,
      publishingSector,
      gamingSector,
      streamingSector,
    ]);

    console.log('✅ Bolloré seeding completed with all links!');
  }
}
