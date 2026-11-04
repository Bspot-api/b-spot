import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { CompanyService } from '../company/company.service';
import { BrandService } from '../brand/brand.service';
import { BrandDiscoveryService } from '../brand/brand-discovery.service';
import { Brand, BrandStatus } from '../brand/brand.entity';
import { BrandSuggestionService } from '../brand-suggestion/brand-suggestion.service';
import type { ProductDto } from '../product/dto/product.dto';
import type { BrandScanResultDto, ScanResultDto } from './dto/scan.dto';
import type { ScanHistoryResponseDto } from './dto/scan-history.dto';

const QUOTA_UNAVAILABLE_MESSAGE =
  'Données entreprise temporairement indisponibles (quota Pappers atteint)';
const PENDING_BRAND_MESSAGE = 'Correspondance marque trouvée, en attente de validation';

type ResolvedBrandResolution = Exclude<
  NonNullable<BrandScanResultDto['brandResolution']>,
  'needs_user_input'
>;

/** A brand matched in the DB or created by auto discovery. */
interface ResolvedBrandLookup {
  brand: Brand;
  brandResolution: ResolvedBrandResolution;
  discoveryConfidence?: number;
}

/** No brand could be matched: the caller asks the user for input. */
interface UnresolvedBrandLookup {
  brand: null;
  discoveryConfidence?: number;
  discoveryMessage?: string;
}

type BrandLookup = ResolvedBrandLookup | UnresolvedBrandLookup;

@Injectable()
export class ScanService {
  private readonly logger = new Logger(ScanService.name);

  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly brandDiscoveryService: BrandDiscoveryService,
    private readonly brandSuggestionService: BrandSuggestionService,
    private readonly companyService: CompanyService,
  ) {}

  async scanProduct(barcode: string): Promise<ScanResultDto> {
    // Step 1: Fetch product from Open Food Facts, with Open Beauty Facts fallback.
    const productDto = await this.productService.fetchProduct(barcode);
    if (!productDto) {
      throw new NotFoundException(`Produit introuvable pour le code-barres ${barcode}`);
    }

    // Step 2: Save product to DB (upsert)
    await this.productService.saveProduct(productDto);

    // Step 3: Find brand in our DB
    if (!productDto.brandName) {
      this.logger.warn(`No brand name for barcode ${barcode}`);
      return {
        product: productDto,
        dataFreshness: 'unavailable',
        message: 'Aucune marque associée à ce produit',
        brandResolution: 'needs_user_input',
        userActionRequired: 'submit_brand_suggestion',
      };
    }

    const lookup = await this.resolveBrand(productDto.brandName);
    if (!lookup.brand) return this.suggestUnresolvedBrand(productDto, productDto.brandName, lookup);

    // Step 4: Fetch company from Pappers (cache-first)
    const companyResult = await this.buildCompanyResult(lookup);
    return { product: productDto, ...companyResult };
  }

  async scanBySiren(siren: string, brandName?: string): Promise<BrandScanResultDto> {
    const company = await this.companyService.getOrCreateCompany(siren);
    if (!company) {
      return {
        dataFreshness: 'unavailable',
        message: `Impossible de récupérer les données pour le SIREN ${siren}`,
      };
    }

    if (brandName) {
      const existing = await this.brandService.findBrandBySiren(siren);
      if (!existing) {
        await this.brandService.createBrand(brandName, siren);
        this.logger.log(`Brand "${brandName}" created for SIREN ${siren}`);
      }
    }

    return {
      company: this.companyService.toDto(company),
      dataFreshness: 'fresh',
      brandResolution: 'existing',
      brandStatus: BrandStatus.ACTIVE,
    };
  }

  getHistory(limit: number, offset: number): ScanHistoryResponseDto {
    return { items: [], total: 0, limit, offset };
  }

  async scanByBrandName(brandName: string): Promise<BrandScanResultDto> {
    const lookup = await this.resolveBrand(brandName);
    if (!lookup.brand) {
      return {
        dataFreshness: 'unavailable',
        message:
          lookup.discoveryMessage ??
          `Marque "${brandName}" non trouvée avec certitude. Essayez un nom plus précis.`,
        brandResolution: 'needs_user_input',
        discoveryConfidence: lookup.discoveryConfidence,
      };
    }

    return this.buildCompanyResult(lookup);
  }

  private async suggestUnresolvedBrand(
    productDto: ProductDto,
    brandName: string,
    lookup: UnresolvedBrandLookup,
  ): Promise<ScanResultDto> {
    const suggestion = await this.brandSuggestionService.createFromScan(productDto);
    return {
      product: productDto,
      dataFreshness: 'unavailable',
      message:
        lookup.discoveryMessage ??
        `Marque "${brandName}" non référencée et non résolue automatiquement`,
      brandResolution: 'needs_user_input',
      discoveryConfidence: lookup.discoveryConfidence,
      userActionRequired: 'submit_brand_suggestion',
      brandSuggestionId: suggestion?.id,
    };
  }

  private async resolveBrand(brandName: string): Promise<BrandLookup> {
    const brand = await this.brandService.findBrandByName(brandName);
    if (brand) return { brand, brandResolution: 'existing' };

    this.logger.warn(`Brand not found in DB: "${brandName}" — trying auto discovery`);
    const discovery = await this.brandDiscoveryService.discoverAndPersistBrand(brandName);
    if (!discovery.brand) {
      return {
        brand: null,
        discoveryConfidence: discovery.confidence,
        discoveryMessage: discovery.message,
      };
    }

    let brandResolution: ResolvedBrandResolution = 'existing';
    if (discovery.resolution === 'auto_active') brandResolution = 'auto_active';
    if (discovery.resolution === 'auto_pending') brandResolution = 'auto_pending';
    return { brand: discovery.brand, brandResolution, discoveryConfidence: discovery.confidence };
  }

  private async buildCompanyResult(lookup: ResolvedBrandLookup): Promise<BrandScanResultDto> {
    const { brand, brandResolution, discoveryConfidence } = lookup;
    const company = await this.companyService.getOrCreateCompany(brand.siren);
    if (!company) {
      return {
        dataFreshness: 'unavailable',
        message: QUOTA_UNAVAILABLE_MESSAGE,
        brandResolution,
        brandStatus: brand.status,
        discoveryConfidence,
      };
    }

    return {
      company: this.companyService.toDto(company),
      dataFreshness: 'fresh',
      brandResolution,
      brandStatus: brand.status,
      discoveryConfidence,
      message: brand.status === BrandStatus.PENDING ? PENDING_BRAND_MESSAGE : undefined,
    };
  }
}
