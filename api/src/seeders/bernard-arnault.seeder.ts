import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Brand } from '../modules/brand/brand.entity';
import { Company } from '../modules/company/company.entity';
import {
  EntityRelation,
  EntityType,
  RelationType,
} from '../modules/entity-relation/entity-relation.entity';
import { Fund } from '../modules/fund/fund.entity';
import {
  PersonalityRelation,
  PersonalityRelationType,
} from '../modules/personality/personality-relation.entity';
import { Personality } from '../modules/personality/personality.entity';
import { Sector } from '../modules/sector/sector.entity';

export class BernardArnaultSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting BernardArnault seeding...');

    // 1. CRÉER LES SECTEURS
    const luxurySector = await this.createOrFindSector(
      em,
      'Luxury & Fashion',
      'Secteur du luxe comprenant mode, maroquinerie, joaillerie, horlogerie, vins & spiritueux. Arnault domine ce secteur via LVMH.',
    );
    const mediaSector = await this.createOrFindSector(
      em,
      'Media & Communication',
      'Secteur des médias (presse, radio) où Arnault possède Les Echos et Le Parisien.',
    );

    // 2. CRÉER LES PERSONNALITÉS
    const bernardArnault = await this.createOrFindPersonality(
      em,
      'Bernard Arnault',
      'Milliardaire français, PDG du groupe de luxe LVMH. Principal actionnaire via sa holding familiale. Influence politique et économique considérable.',
    );
    const delphineArnault = await this.createOrFindPersonality(
      em,
      'Delphine Arnault',
      'Fille aînée de Bernard Arnault, dirigeante de LVMH (DG de Christian Dior Couture depuis 2023, administratrice de LVMH).',
    );
    const antoineArnault = await this.createOrFindPersonality(
      em,
      'Antoine Arnault',
      'Fils de Bernard Arnault, ancien DG de Berluti (2011-2023), PDG de Christian Dior SE (holding) depuis 2022, en charge de la communication du groupe.',
    );
    const alexandreArnault = await this.createOrFindPersonality(
      em,
      'Alexandre Arnault',
      'Fils de Bernard Arnault, VP exécutif de Tiffany & Co. depuis 2021 (après rachat par LVMH), ex-DG de Rimowa.',
    );
    const fredericArnault = await this.createOrFindPersonality(
      em,
      'Frédéric Arnault',
      'Fils de Bernard Arnault, PDG de TAG Heuer depuis 2020, pilote la stratégie horlogère du groupe.',
    );
    const jeanArnault = await this.createOrFindPersonality(
      em,
      'Jean Arnault',
      'Fils cadet de Bernard Arnault, directeur du marketing horlogerie chez Louis Vuitton.',
    );
    const xavierNiel = await this.createOrFindPersonality(
      em,
      'Xavier Niel',
      "Gendre de Bernard Arnault (époux de Delphine Arnault) et entrepreneur des télécoms (fondateur d'Iliad/Free).",
    );
    const francoisPinault = await this.createOrFindPersonality(
      em,
      'François Pinault',
      'Homme d’affaires milliardaire, fondateur de Kering (anciennement PPR). Rival historique de Bernard Arnault dans le luxe (Gucci, etc.).',
    );

    // 3. CRÉER LES FONDS
    const arnaultHolding = await this.createOrFindFund(
      em,
      'Groupe Arnault (Agache)',
      "Holding familiale des Arnault (Agache), détient ~97% de Christian Dior SE et ~48% de LVMH. Véhicule d'investissement fondé par Bernard Arnault.",
    );

    // 4. CRÉER LES ENTREPRISES
    const lvmh = await this.createOrFindCompany(
      em,
      'LVMH',
      'LVMH Moët Hennessy Louis Vuitton, numéro un mondial du luxe avec plus de 70 marques (Louis Vuitton, Dior, Bulgari, etc.). Bernard Arnault en est PDG et actionnaire majoritaire (via sa holding).',
      'https://www.lvmh.com',
    );
    const carrefour = await this.createOrFindCompany(
      em,
      'Carrefour',
      'Groupe français de grande distribution. Bernard Arnault a détenu ~10% de Carrefour de 2007 à 2021 via Blue Capital (partenariat avec Colony Capital).',
      'https://www.carrefour.com',
    );
    const mediaGroup = await this.createOrFindCompany(
      em,
      'Les Echos-Le Parisien',
      'Groupe de presse détenu par LVMH (Les Echos, quotidien économique, acquis en 2007, et Le Parisien, quotidien régional/national, acquis en 2015).',
      'https://lesechosleparisien.fr',
    ); // fictitious URL for the media group

    // 5. CRÉER LES MARQUES
    const dior = await this.createOrFindBrand(
      em,
      'Christian Dior',
      'Marque de mode de luxe emblématique (haute couture, prêt-à-porter, maroquinerie). Acquise par Bernard Arnault en 1984, intégrée à LVMH. Delphine Arnault en est la DG depuis 2023.',
      lvmh,
    );
    const tagHeuer = await this.createOrFindBrand(
      em,
      'TAG Heuer',
      'Manufacture horlogère suisse renommée pour ses montres sportives. Fait partie de LVMH (division Montres & Joaillerie). Frédéric Arnault en est PDG depuis 2020.',
      lvmh,
    );
    const tiffany = await this.createOrFindBrand(
      em,
      'Tiffany & Co.',
      'Joaillier de luxe américain (fondé en 1837), célèbre pour ses diamants et son Blue Box. Racheté par LVMH en 2021 pour 15,8 Mds$. Alexandre Arnault y occupe un poste de direction.',
      lvmh,
    );
    const berluti = await this.createOrFindBrand(
      em,
      'Berluti',
      'Marque de luxe masculine (chaussures, maroquinerie, prêt-à-porter) fondée en 1895 et acquise par LVMH. Antoine Arnault a été DG de Berluti (2011-2023).',
      lvmh,
    );

    // 6. CRÉER LES RELATIONS BUSINESS (EntityRelation)

    // Bernard Arnault possède sa holding familiale (Groupe Arnault/Agache).
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: bernardArnault.id,
      targetType: EntityType.FUND,
      targetId: arnaultHolding.id,
      relationType: RelationType.OWNS,
      strength: 1.0,
      startDate: new Date('1989-01-01'),
      notes:
        'Fondateur et propriétaire du holding familial (Agache/Groupe Arnault).',
    });

    // La holding familiale contrôle LVMH (via Christian Dior SE, ~48% du capital).
    await this.createEntityRelation(em, {
      sourceType: EntityType.FUND,
      sourceId: arnaultHolding.id,
      targetType: EntityType.COMPANY,
      targetId: lvmh.id,
      relationType: RelationType.CONTROLS,
      strength: 0.48,
      notes:
        'Contrôle majoritaire de LVMH via 41% Dior + parts directes (~48% capital, >60% droits de vote).',
    });

    // La holding (Groupe Arnault) a investi dans Carrefour (en a détenu ~10%).
    await this.createEntityRelation(em, {
      sourceType: EntityType.FUND,
      sourceId: arnaultHolding.id,
      targetType: EntityType.COMPANY,
      targetId: carrefour.id,
      relationType: RelationType.INVESTS_IN,
      strength: 0.1,
      startDate: new Date('2007-03-01'),
      endDate: new Date('2021-09-01'),
      notes:
        'Participation (~9.8%) dans Carrefour via Blue Capital (avec Colony Capital).',
    });

    // LVMH possède le groupe Les Echos-Le Parisien (médias).
    await this.createEntityRelation(em, {
      sourceType: EntityType.COMPANY,
      sourceId: lvmh.id,
      targetType: EntityType.COMPANY,
      targetId: mediaGroup.id,
      relationType: RelationType.OWNS,
      strength: 1.0,
      startDate: new Date('2015-10-30'),
      notes:
        'LVMH propriétaire à 100% des journaux Les Echos (depuis 2007) et Le Parisien (depuis 2015).',
    });

    // LVMH opère dans le secteur Luxury & Fashion.
    await this.createEntityRelation(em, {
      sourceType: EntityType.COMPANY,
      sourceId: lvmh.id,
      targetType: EntityType.SECTOR,
      targetId: luxurySector.id,
      relationType: RelationType.OPERATES_IN,
      strength: 1.0,
      notes: 'LVMH est actif dans le luxe (mode, joaillerie, vins, etc.).',
    });

    // Les Echos-Le Parisien opère dans le secteur Media & Communication.
    await this.createEntityRelation(em, {
      sourceType: EntityType.COMPANY,
      sourceId: mediaGroup.id,
      targetType: EntityType.SECTOR,
      targetId: mediaSector.id,
      relationType: RelationType.OPERATES_IN,
      strength: 1.0,
      notes: 'Activité de presse écrite et médias.',
    });

    // Delphine Arnault dirige Christian Dior (marque Couture) depuis 2023.
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: delphineArnault.id,
      targetType: EntityType.BRAND,
      targetId: dior.id,
      relationType: RelationType.MANAGES,
      strength: 1.0,
      startDate: new Date('2023-01-11'),
      notes: 'CEO de Christian Dior Couture.',
    });

    // Antoine Arnault a dirigé Berluti (2011-2023).
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: antoineArnault.id,
      targetType: EntityType.BRAND,
      targetId: berluti.id,
      relationType: RelationType.MANAGES,
      strength: 1.0,
      startDate: new Date('2011-01-01'),
      endDate: new Date('2023-01-01'),
      notes: 'Directeur Général de Berluti (2011 à 2023).',
    });

    // Alexandre Arnault occupe un poste de direction chez Tiffany & Co.
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: alexandreArnault.id,
      targetType: EntityType.BRAND,
      targetId: tiffany.id,
      relationType: RelationType.MANAGES,
      strength: 0.8,
      startDate: new Date('2021-01-01'),
      notes:
        'Vice-président exécutif Produits & Communication chez Tiffany & Co.',
    });

    // Frédéric Arnault dirige TAG Heuer depuis 2020.
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: fredericArnault.id,
      targetType: EntityType.BRAND,
      targetId: tagHeuer.id,
      relationType: RelationType.MANAGES,
      strength: 1.0,
      startDate: new Date('2020-07-01'),
      notes: 'CEO de TAG Heuer.',
    });

    // LVMH a acquis Tiffany & Co. en 2021.
    await this.createEntityRelation(em, {
      sourceType: EntityType.COMPANY,
      sourceId: lvmh.id,
      targetType: EntityType.BRAND,
      targetId: tiffany.id,
      relationType: RelationType.ACQUIRED,
      strength: 1.0,
      startDate: new Date('2021-01-07'),
      notes: 'Acquisition de Tiffany & Co. pour 15,8 milliards $ en 2021.',
    });

    // Ajouter les relations personnalités → companies pour l'affichage
    
    // Bernard Arnault contrôle LVMH
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: bernardArnault.id,
      targetType: EntityType.COMPANY,
      targetId: lvmh.id,
      relationType: RelationType.CONTROLS,
      strength: 1.0,
      notes: 'Président-directeur général et actionnaire majoritaire de LVMH.',
    });

    // Delphine Arnault liée à LVMH (administratrice + DG Dior)
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: delphineArnault.id,
      targetType: EntityType.COMPANY,
      targetId: lvmh.id,
      relationType: RelationType.MANAGES,
      strength: 0.8,
      notes: 'Administratrice de LVMH et DG de Christian Dior Couture.',
    });

    // Antoine Arnault lié à LVMH
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: antoineArnault.id,
      targetType: EntityType.COMPANY,
      targetId: lvmh.id,
      relationType: RelationType.MANAGES,
      strength: 0.7,
      notes: 'Responsable communication du groupe LVMH.',
    });

    // Alexandre Arnault lié à LVMH (via Tiffany)
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: alexandreArnault.id,
      targetType: EntityType.COMPANY,
      targetId: lvmh.id,
      relationType: RelationType.MANAGES,
      strength: 0.6,
      notes: 'VP exécutif chez Tiffany & Co. (filiale LVMH).',
    });

    // Frédéric Arnault lié à LVMH (via TAG Heuer)
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: fredericArnault.id,
      targetType: EntityType.COMPANY,
      targetId: lvmh.id,
      relationType: RelationType.MANAGES,
      strength: 0.6,
      notes: 'CEO de TAG Heuer (marque LVMH).',
    });

    // Jean Arnault lié à LVMH
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: jeanArnault.id,
      targetType: EntityType.COMPANY,
      targetId: lvmh.id,
      relationType: RelationType.MANAGES,
      strength: 0.5,
      notes: 'Directeur marketing horlogerie chez Louis Vuitton.',
    });

    // Bernard Arnault lié aux Echos-Le Parisien (propriétaire via LVMH)
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: bernardArnault.id,
      targetType: EntityType.COMPANY,
      targetId: mediaGroup.id,
      relationType: RelationType.OWNS,
      strength: 1.0,
      notes: 'Propriétaire des journaux Les Echos et Le Parisien via LVMH.',
    });

    // Bernard Arnault lié à Carrefour (investissement via sa holding)
    await this.createEntityRelation(em, {
      sourceType: EntityType.PERSONALITY,
      sourceId: bernardArnault.id,
      targetType: EntityType.COMPANY,
      targetId: carrefour.id,
      relationType: RelationType.INVESTS_IN,
      strength: 0.1,
      startDate: new Date('2007-03-01'),
      endDate: new Date('2021-09-01'),
      notes: 'Participation (~9.8%) dans Carrefour via sa holding Blue Capital.',
    });

    // 7. CRÉER LES RELATIONS INTERPERSONNELLES (PersonalityRelation)

    // Bernard Arnault et ses enfants (liens familiaux)
    await this.createPersonalityRelation(em, {
      sourcePersonality: bernardArnault,
      targetPersonality: delphineArnault,
      relationType: PersonalityRelationType.IS_FAMILY_OF,
      notes: 'Père et fille (Delphine est la fille aînée de Bernard Arnault).',
    });
    await this.createPersonalityRelation(em, {
      sourcePersonality: bernardArnault,
      targetPersonality: antoineArnault,
      relationType: PersonalityRelationType.IS_FAMILY_OF,
      notes: 'Père et fils (Antoine Arnault).',
    });
    await this.createPersonalityRelation(em, {
      sourcePersonality: bernardArnault,
      targetPersonality: alexandreArnault,
      relationType: PersonalityRelationType.IS_FAMILY_OF,
      notes: 'Père et fils (Alexandre Arnault).',
    });
    await this.createPersonalityRelation(em, {
      sourcePersonality: bernardArnault,
      targetPersonality: fredericArnault,
      relationType: PersonalityRelationType.IS_FAMILY_OF,
      notes: 'Père et fils (Frédéric Arnault).',
    });
    await this.createPersonalityRelation(em, {
      sourcePersonality: bernardArnault,
      targetPersonality: jeanArnault,
      relationType: PersonalityRelationType.IS_FAMILY_OF,
      notes: 'Père et fils (Jean Arnault).',
    });

    // Lien familial par alliance : Bernard Arnault est le beau-père de Xavier Niel.
    await this.createPersonalityRelation(em, {
      sourcePersonality: bernardArnault,
      targetPersonality: xavierNiel,
      relationType: PersonalityRelationType.IS_FAMILY_OF,
      notes:
        'Beau-père et gendre (Xavier Niel a épousé Delphine Arnault en 2010).',
    });

    // Rivalité entre Bernard Arnault et François Pinault.
    await this.createPersonalityRelation(em, {
      sourcePersonality: bernardArnault,
      targetPersonality: francoisPinault,
      relationType: PersonalityRelationType.IS_RIVAL_OF,
      notes:
        'Rival de longue date dans le secteur du luxe (LVMH vs Kering, bataille Gucci).',
    });

    console.log('✅ BernardArnault seeding completed with all relations!');
  }

  // Helper methods to create or find entities...
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

  private async createOrFindPersonality(
    em: EntityManager,
    name: string,
    description: string,
  ): Promise<Personality> {
    let person = await em.findOne(Personality, { name });
    if (!person) {
      person = new Personality();
      person.name = name;
      person.description = description;
      person.published = true;
      await em.persistAndFlush(person);
      console.log(`✅ Created personality: ${name}`);
    }
    return person;
  }

  private async createOrFindFund(
    em: EntityManager,
    name: string,
    description: string,
  ): Promise<Fund> {
    let fund = await em.findOne(Fund, { name });
    if (!fund) {
      fund = new Fund();
      fund.name = name;
      fund.description = description;
      fund.published = true;
      await em.persistAndFlush(fund);
      console.log(`✅ Created fund: ${name}`);
    }
    return fund;
  }

  private async createOrFindCompany(
    em: EntityManager,
    name: string,
    description: string,
    source: string,
  ): Promise<Company> {
    let company = await em.findOne(Company, { name });
    if (!company) {
      company = new Company();
      company.name = name;
      company.description = description;
      company.source = source;
      company.published = true;
      await em.persistAndFlush(company);
      console.log(`✅ Created company: ${name}`);
    }
    return company;
  }

  private async createOrFindBrand(
    em: EntityManager,
    name: string,
    description: string,
    company: Company,
  ): Promise<Brand> {
    let brand = await em.findOne(Brand, { name });
    if (!brand) {
      brand = new Brand();
      brand.name = name;
      brand.description = description;
      brand.company = company;
      brand.published = true;
      await em.persistAndFlush(brand);
      console.log(`✅ Created brand: ${name}`);
    }
    return brand;
  }

  private async createEntityRelation(
    em: EntityManager,
    data: Partial<EntityRelation>,
  ): Promise<void> {
    const existing = await em.findOne(EntityRelation, {
      sourceType: data.sourceType,
      sourceId: data.sourceId,
      targetType: data.targetType,
      targetId: data.targetId,
      relationType: data.relationType,
    });
    if (!existing) {
      const relation = new EntityRelation();
      Object.assign(relation, data);
      await em.persistAndFlush(relation);
      console.log(
        `🔗 Created relation: ${data.relationType} between ${data.sourceId} and ${data.targetId}`,
      );
    }
  }

  private async createPersonalityRelation(
    em: EntityManager,
    data: Partial<PersonalityRelation>,
  ): Promise<void> {
    const existing = await em.findOne(PersonalityRelation, {
      sourcePersonality: data.sourcePersonality,
      targetPersonality: data.targetPersonality,
      relationType: data.relationType,
    });
    if (!existing) {
      const relation = new PersonalityRelation();
      Object.assign(relation, data);
      await em.persistAndFlush(relation);
      console.log(
        `👥 Created personality relation: ${data.relationType} between ${data.sourcePersonality.name} and ${data.targetPersonality.name}`,
      );
    }
  }
}
