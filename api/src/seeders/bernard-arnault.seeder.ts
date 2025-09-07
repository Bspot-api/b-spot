import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Company } from '../modules/company/company.entity';
import { Fund } from '../modules/fund/fund.entity';
import { Personality } from '../modules/personality/personality.entity';
import { Sector } from '../modules/sector/sector.entity';

export class BernardArnaultSeeder extends Seeder {
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
    console.log('🌱 Starting Bernard Arnault seeding...');

    // Créer les secteurs principaux
    const holdingSector = await this.createOrFindSector(
      em,
      'Holdings & Investissement',
      "Secteur des holdings familiaux et sociétés d'investissement",
    );
    const modeSector = await this.createOrFindSector(
      em,
      'Mode & Luxe',
      'Secteur des produits de luxe, mode, haute couture, joaillerie et cosmétique',
    );
    const mediaSector = await this.createOrFindSector(
      em,
      'Presse & Médias',
      'Secteur des médias, presse écrite, radio et communication',
    );
    const distributionSector = await this.createOrFindSector(
      em,
      'Distribution & Commerce',
      'Secteur de la grande distribution et du commerce de détail',
    );

    // Créer le principal fonds/holding familial
    let agacheFund = await em.findOne(Fund, { name: 'Agache' });
    if (!agacheFund) {
      agacheFund = new Fund();
      agacheFund.name = 'Agache';
      agacheFund.description =
        "Holding familial des Arnault (ex-Groupe Arnault). Détient ~97% de Christian Dior SE, qui possède ~41% du capital de LVMH:contentReference[oaicite:39]{index=39}. Contrôlé à ~81% par Bernard Arnault via Pilinvest:contentReference[oaicite:40]{index=40}. Transformé en société en commandite par actions en 2022 pour assurer le contrôle familial:contentReference[oaicite:41]{index=41}. Actif principalement dans le luxe (LVMH) et présent dans d'autres secteurs (ex: participations passées dans Carrefour, médias - Les Echos, Le Parisien...).";
      agacheFund.published = true;
      await em.persistAndFlush(agacheFund);
      console.log('✅ Created Agache fund');
    }

    // Créer les personnalités (Bernard Arnault et enfants)
    let bernardArnault = await em.findOne(Personality, {
      name: 'Bernard Arnault',
    });
    if (!bernardArnault) {
      bernardArnault = new Personality();
      bernardArnault.name = 'Bernard Arnault';
      bernardArnault.description =
        'Milliardaire français, PDG du groupe LVMH depuis 1989, actionnaire majoritaire via le holding familial Agache. Surnommé le “tycoon du luxe”, il a bâti un empire de plus de 70 marques (Louis Vuitton, Dior, Tiffany...):contentReference[oaicite:42]{index=42}. Également propriétaire de médias (Les Echos, Le Parisien) et ex-actionnaire de Carrefour:contentReference[oaicite:43]{index=43}. Longtemps homme le plus riche du monde en 2023-2024:contentReference[oaicite:44]{index=44}.';
      bernardArnault.published = true;
      try {
        await em.persistAndFlush(bernardArnault);
        console.log('✅ Created Bernard Arnault personality');
      } catch (error) {
        console.log(
          '   ⚠️  Bernard Arnault personality already exists, skipping...',
        );
        bernardArnault = await em.findOne(Personality, {
          name: 'Bernard Arnault',
        });
      }
    }

    let delphineArnault = await em.findOne(Personality, {
      name: 'Delphine Arnault',
    });
    if (!delphineArnault) {
      delphineArnault = new Personality();
      delphineArnault.name = 'Delphine Arnault';
      delphineArnault.description =
        'Fille aînée de Bernard Arnault, dirigeante dans le luxe. CEO de Christian Dior Couture depuis 2023:contentReference[oaicite:45]{index=45}, après 12 ans chez Louis Vuitton (ex-DG adjointe produits). Administratrice de LVMH, elle incarne la relève familiale dans la mode.';
      delphineArnault.published = true;
      try {
        await em.persistAndFlush(delphineArnault);
        console.log('✅ Created Delphine Arnault personality');
      } catch (error) {
        console.log(
          '   ⚠️  Delphine Arnault personality already exists, skipping...',
        );
        delphineArnault = await em.findOne(Personality, {
          name: 'Delphine Arnault',
        });
      }
    }

    let antoineArnault = await em.findOne(Personality, {
      name: 'Antoine Arnault',
    });
    if (!antoineArnault) {
      antoineArnault = new Personality();
      antoineArnault.name = 'Antoine Arnault';
      antoineArnault.description =
        'Fils de Bernard Arnault, en charge de la communication & image du groupe LVMH. CEO de Christian Dior SE (holding de la famille) depuis fin 2022:contentReference[oaicite:46]{index=46}. Ex-CEO de Berluti, il reste président de cette maison et préside Loro Piana:contentReference[oaicite:47]{index=47}. Administrateur de LVMH.';
      antoineArnault.published = true;
      try {
        await em.persistAndFlush(antoineArnault);
        console.log('✅ Created Antoine Arnault personality');
      } catch (error) {
        console.log(
          '   ⚠️  Antoine Arnault personality already exists, skipping...',
        );
        antoineArnault = await em.findOne(Personality, {
          name: 'Antoine Arnault',
        });
      }
    }

    let alexandreArnault = await em.findOne(Personality, {
      name: 'Alexandre Arnault',
    });
    if (!alexandreArnault) {
      alexandreArnault = new Personality();
      alexandreArnault.name = 'Alexandre Arnault';
      alexandreArnault.description =
        "Fils de Bernard Arnault. Vice-Président Exécutif de Tiffany & Co. (produits et communication) depuis 2021:contentReference[oaicite:48]{index=48}, après avoir dirigé Rimowa (2016-2020). Membre du conseil d'administration de LVMH, il représente la nouvelle génération du groupe.";
      alexandreArnault.published = true;
      try {
        await em.persistAndFlush(alexandreArnault);
        console.log('✅ Created Alexandre Arnault personality');
      } catch (error) {
        console.log(
          '   ⚠️  Alexandre Arnault personality already exists, skipping...',
        );
        alexandreArnault = await em.findOne(Personality, {
          name: 'Alexandre Arnault',
        });
      }
    }

    let fredericArnault = await em.findOne(Personality, {
      name: 'Frédéric Arnault',
    });
    if (!fredericArnault) {
      fredericArnault = new Personality();
      fredericArnault.name = 'Frédéric Arnault';
      fredericArnault.description =
        "Fils de Bernard Arnault. CEO de TAG Heuer (2020-2023) puis CEO de la division Montres de LVMH en 2024:contentReference[oaicite:49]{index=49}. Managing Director du holding familial Financière Agache:contentReference[oaicite:50]{index=50}, il incarne l'innovation technologique du groupe (montres connectées, partenariats F1).";
      fredericArnault.published = true;
      try {
        await em.persistAndFlush(fredericArnault);
        console.log('✅ Created Frédéric Arnault personality');
      } catch (error) {
        console.log(
          '   ⚠️  Frédéric Arnault personality already exists, skipping...',
        );
        fredericArnault = await em.findOne(Personality, {
          name: 'Frédéric Arnault',
        });
      }
    }

    let jeanArnault = await em.findOne(Personality, { name: 'Jean Arnault' });
    if (!jeanArnault) {
      jeanArnault = new Personality();
      jeanArnault.name = 'Jean Arnault';
      jeanArnault.description =
        "Plus jeune fils de Bernard Arnault. Depuis 2021, directeur Marketing & Développement de l'activité Horlogerie chez Louis Vuitton:contentReference[oaicite:51]{index=51}. Diplômé en mathématiques financières (MIT) et en ingénierie (Imperial College), il apporte une vision nouvelle à la division horlogerie du groupe.";
      jeanArnault.published = true;
      try {
        await em.persistAndFlush(jeanArnault);
        console.log('✅ Created Jean Arnault personality');
      } catch (error) {
        console.log(
          '   ⚠️  Jean Arnault personality already exists, skipping...',
        );
        jeanArnault = await em.findOne(Personality, { name: 'Jean Arnault' });
      }
    }

    // Créer les liens entre entités principales
    console.log('🔗 Creating links between entities...');
    try {
      agacheFund.personalities.add(bernardArnault);
      bernardArnault.funds.add(agacheFund);
      agacheFund.sectors.add(holdingSector);
      holdingSector.funds.add(agacheFund);
      agacheFund.sectors.add(modeSector);
      modeSector.funds.add(agacheFund);
      agacheFund.sectors.add(mediaSector);
      mediaSector.funds.add(agacheFund);
      agacheFund.sectors.add(distributionSector);
      distributionSector.funds.add(agacheFund);
      console.log(
        '   ✅ Linked Agache fund with Bernard Arnault and all sectors',
      );
    } catch (error) {
      console.log('   ⚠️  Some links already exist, continuing...');
    }

    // Créer les entreprises principales associées
    console.log('🏢 Creating companies...');
    const companies = [
      {
        name: 'Christian Dior SE',
        description:
          "Holding coté contrôlé par la famille Arnault (~97% d'Agache). Détient ~41% du capital de LVMH:contentReference[oaicite:52]{index=52} et 100% de Dior Couture. Antoine Arnault en est le directeur général depuis 2022.",
        source: 'https://www.dior-finance.com/fr',
        sector: holdingSector,
        personality: antoineArnault,
      },
      {
        name: 'LVMH Moët Hennessy Louis Vuitton',
        description:
          'Leader mondial des produits de luxe (mode, maroquinerie, joaillerie, parfums, vins & spiritueux). Bernard Arnault en est le PDG et actionnaire majoritaire via Dior SE. Regroupe plus de 75 marques dont Louis Vuitton, Dior, Tiffany, etc.',
        source: 'https://www.lvmh.com',
        sector: modeSector,
        personality: bernardArnault,
      },
      {
        name: 'Christian Dior Couture',
        description:
          'Maison de couture de prestige (fondée en 1946). Intégralement détenue par LVMH depuis 2017. Référence du luxe parisien (mode féminine, haute couture). Delphine Arnault en assure la direction générale depuis 2023.',
        source: 'https://www.dior.com',
        sector: modeSector,
        personality: delphineArnault,
      },
      {
        name: 'Louis Vuitton',
        description:
          'Première marque de luxe au monde (mode & maroquinerie), fleuron historique de LVMH. Célèbre pour ses malles et monogramme LV. Jean Arnault y dirige le marketing Horlogerie, apportant un souffle nouveau sur les montres Louis Vuitton.',
        source: 'https://www.louisvuitton.com',
        sector: modeSector,
        personality: jeanArnault,
      },
      {
        name: 'Tiffany & Co.',
        description:
          'Maison américaine de joaillerie haut de gamme (New York, 1837), rachetée par LVMH en 2021 pour $16 milliards:contentReference[oaicite:53]{index=53}. Réputée pour ses diamants et sa célèbre Blue Box. Alexandre Arnault y occupe un poste de vice-président exécutif depuis l’acquisition.',
        source: 'https://www.tiffany.com',
        sector: modeSector,
        personality: alexandreArnault,
      },
      {
        name: 'TAG Heuer',
        description:
          'Manufacture horlogère suisse (fondée 1860), intégrée à LVMH en 1999. Innovatrice dans les montres sportives et connectées. Frédéric Arnault en a été le CEO de 2020 à 2023, modernisant la marque avant de prendre la tête de la division Montres du groupe.',
        source: 'https://www.tagheuer.com',
        sector: modeSector,
        personality: fredericArnault,
      },
      {
        name: 'Les Échos',
        description:
          'Quotidien économique français de référence, fondé en 1908. Racheté par LVMH en 2007:contentReference[oaicite:54]{index=54}, il fait partie de son pôle médias. Diffuse les actualités économiques et financières, avec une influence notable dans les cercles d’affaires.',
        source: 'https://www.lesechos.fr',
        sector: mediaSector,
        personality: bernardArnault,
      },
      {
        name: 'Le Parisien',
        description:
          'Quotidien généraliste français (et son édition nationale *Aujourd’hui en France*). Acquis par LVMH en 2015:contentReference[oaicite:55]{index=55}, il est l’un des principaux journaux d’Île-de-France. Cette diversification de LVMH dans la presse vise à pérenniser ce titre populaire.',
        source: 'https://www.leparisien.fr',
        sector: mediaSector,
        personality: bernardArnault,
      },
      {
        name: 'Carrefour (participation Agache)',
        description:
          'Chaîne française de grande distribution (hypermarchés). Agache (Arnault) a détenu ~9.8% du capital de Carrefour de 2007 à 2021:contentReference[oaicite:56]{index=56} via Blue Capital, avant de céder sa participation (5.7% restants vendus pour 724 M€ en 2021):contentReference[oaicite:57]{index=57}.',
        source: 'https://www.carrefour.com',
        sector: distributionSector,
        personality: bernardArnault,
      },
    ];

    for (const companyData of companies) {
      await this.createOrFindCompany(
        em,
        companyData.name,
        companyData.description,
        companyData.source,
        agacheFund,
        companyData.sector,
        companyData.personality,
      );
    }

    // Persister tous les changements
    await em.persistAndFlush([
      agacheFund,
      bernardArnault,
      holdingSector,
      modeSector,
      mediaSector,
      distributionSector,
    ]);

    console.log('✅ Bernard Arnault seeding completed with all links!');
  }
}
