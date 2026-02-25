import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { ExternalApi } from '../cache/api-usage-log.entity';
import type { CompanyData } from './dto/company.dto';
import type { Executive, Shareholder } from './company.entity';

const PAPPERS_API = 'https://api.pappers.fr/v2/entreprise';

interface PappersRepresentant {
  nom?: string;
  prenom?: string;
  qualite?: string;
  date_debut?: string;
}

interface PappersBeneficiaire {
  nom?: string;
  prenom?: string;
  pourcentages_parts?: number;
  type_personne?: string;
}

interface PappersResponse {
  siren?: string;
  denomination?: string;
  nom_entreprise?: string;
  representants?: PappersRepresentant[];
  beneficiaires_effectifs?: PappersBeneficiaire[];
  [key: string]: unknown;
}

@Injectable()
export class PappersService {
  private readonly logger = new Logger(PappersService.name);

  constructor(private readonly cacheService: CacheService) {}

  async getCompanyBySiren(siren: string): Promise<CompanyData | null> {
    const cached = await this.cacheService.getCachedPappers(siren);
    if (cached) {
      this.logger.log(`Cache hit for SIREN ${siren}`);
      return this.parseResponse(siren, cached as PappersResponse);
    }

    const exhausted = await this.cacheService.isPappersQuotaExhausted();
    if (exhausted) {
      this.logger.warn(`Quota exhausted — cannot fetch SIREN ${siren} from Pappers`);
      return null;
    }

    return this.fetchFromApi(siren);
  }

  private async fetchFromApi(siren: string): Promise<CompanyData | null> {
    const apiKey = process.env.PAPPERS_API_KEY;
    if (!apiKey) {
      this.logger.warn('PAPPERS_API_KEY not configured');
      return null;
    }

    const url = `${PAPPERS_API}?siren=${siren}&api_token=${apiKey}`;

    try {
      const response = await fetch(url);
      const success = response.ok;
      const endpoint = '/v2/entreprise';

      if (!success) {
        const errorText = await response.text();
        await this.cacheService.logApiCall(ExternalApi.PAPPERS, endpoint, `siren=${siren}`, false, errorText);
        this.logger.error(`Pappers API error for SIREN ${siren}: ${response.status}`);
        return null;
      }

      const data = (await response.json()) as PappersResponse;
      await this.cacheService.logApiCall(ExternalApi.PAPPERS, endpoint, `siren=${siren}`, true);
      await this.cacheService.setCachedPappers(siren, data as Record<string, unknown>);
      await this.cacheService.checkPappersQuota();

      return this.parseResponse(siren, data);
    } catch (err) {
      await this.cacheService.logApiCall(ExternalApi.PAPPERS, '/v2/entreprise', `siren=${siren}`, false, String(err));
      this.logger.error(`Pappers fetch failed for SIREN ${siren}`, err);
      return null;
    }
  }

  private parseResponse(siren: string, data: PappersResponse): CompanyData {
    const legalName = data.denomination ?? data.nom_entreprise ?? `Entreprise ${siren}`;

    const executives: Executive[] = (data.representants ?? []).map((rep) => ({
      name: [rep.prenom, rep.nom].filter(Boolean).join(' ') || 'Inconnu',
      role: rep.qualite ?? 'Dirigeant',
      startDate: rep.date_debut,
    }));

    const shareholders: Shareholder[] = (data.beneficiaires_effectifs ?? []).map((ben) => ({
      name: [ben.prenom, ben.nom].filter(Boolean).join(' ') || 'Inconnu',
      percentage: ben.pourcentages_parts ?? 0,
      type: ben.type_personne === 'morale' ? 'corporate' : 'individual',
    }));

    return {
      siren,
      legalName,
      executives,
      shareholders,
      rawData: data as Record<string, unknown>,
    };
  }
}
