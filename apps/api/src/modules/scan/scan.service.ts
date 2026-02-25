import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { CompanyService } from '../company/company.service';
import { BrandService } from '../brand/brand.service';
import { BrandDiscoveryService } from '../brand/brand-discovery.service';
import { BrandStatus } from '../brand/brand.entity';
import { BrandSuggestionService } from '../brand-suggestion/brand-suggestion.service';
import type { ScanResultDto } from './dto/scan.dto';

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
    // Step 1: Fetch product from Open Food Facts
    const productDto = await this.productService.fetchFromOpenFoodFacts(barcode);
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
}
