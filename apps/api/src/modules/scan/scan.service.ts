import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { CompanyService } from '../company/company.service';
import { BrandService } from '../brand/brand.service';
import { BrandDiscoveryService } from '../brand/brand-discovery.service';
import { BrandStatus } from '../brand/brand.entity';
import { BrandSuggestionService } from '../brand-suggestion/brand-suggestion.service';
import { BrandMatchSource } from '../brand/brand.entity';
import type { BrandScanResultDto, ScanResultDto } from './dto/scan.dto';

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

    let brand = await this.brandService.findBrandByName(productDto.brandName);
    let brandResolution: ScanResultDto['brandResolution'] = 'existing';
    let discoveryConfidence: number | undefined;

    if (!brand) {
      this.logger.warn(`Brand not found in DB: "${productDto.brandName}" — trying auto discovery`);
      const discovery = await this.brandDiscoveryService.discoverAndPersistBrand(productDto.brandName);
      brand = discovery.brand ?? null;
      discoveryConfidence = discovery.confidence;
      if (discovery.resolution === 'auto_active') brandResolution = 'auto_active';
      if (discovery.resolution === 'auto_pending') brandResolution = 'auto_pending';

      if (!brand) {
        const suggestion = await this.brandSuggestionService.createFromScan(productDto);
        return {
          product: productDto,
          dataFreshness: 'unavailable',
          message:
            discovery.message ??
            `Marque "${productDto.brandName}" non référencée et non résolue automatiquement`,
          brandResolution: 'needs_user_input',
          discoveryConfidence,
          userActionRequired: 'submit_brand_suggestion',
          brandSuggestionId: suggestion?.id,
        };
      }
    }

    // Step 4: Fetch company from Pappers (cache-first)
    const company = await this.companyService.getOrCreateCompany(brand.siren);
    if (!company) {
      return {
        product: productDto,
        dataFreshness: 'unavailable',
        message: 'Données entreprise temporairement indisponibles (quota Pappers atteint)',
        brandResolution,
        brandStatus: brand.status,
        discoveryConfidence,
      };
    }

    const companyDto = this.companyService.toDto(company);

    return {
      product: productDto,
      company: companyDto,
      dataFreshness: 'fresh',
      brandResolution,
      brandStatus: brand.status,
      discoveryConfidence,
      message:
        brand.status === BrandStatus.PENDING
          ? 'Correspondance marque trouvée, en attente de validation'
          : undefined,
    };
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

  async scanByBrandName(brandName: string): Promise<BrandScanResultDto> {
    let brand = await this.brandService.findBrandByName(brandName);
    let brandResolution: BrandScanResultDto['brandResolution'] = 'existing';
    let discoveryConfidence: number | undefined;

    if (!brand) {
      this.logger.warn(`Brand not found in DB: "${brandName}" — trying auto discovery`);
      const discovery = await this.brandDiscoveryService.discoverAndPersistBrand(brandName);
      brand = discovery.brand ?? null;
      discoveryConfidence = discovery.confidence;
      if (discovery.resolution === 'auto_active') brandResolution = 'auto_active';
      if (discovery.resolution === 'auto_pending') brandResolution = 'auto_pending';

      if (!brand) {
        return {
          dataFreshness: 'unavailable',
          message:
            discovery.message ??
            `Marque "${brandName}" non trouvée avec certitude. Essayez un nom plus précis.`,
          brandResolution: 'needs_user_input',
          discoveryConfidence,
        };
      }
    }

    const company = await this.companyService.getOrCreateCompany(brand.siren);
    if (!company) {
      return {
        dataFreshness: 'unavailable',
        message: 'Données entreprise temporairement indisponibles (quota Pappers atteint)',
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
      message:
        brand.status === BrandStatus.PENDING
          ? 'Correspondance marque trouvée, en attente de validation'
          : undefined,
    };
  }
}
