import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { CompanyService } from '../company/company.service';
import { BrandService } from '../brand/brand.service';
import type { ScanResultDto } from './dto/scan.dto';

@Injectable()
export class ScanService {
  private readonly logger = new Logger(ScanService.name);

  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
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
      };
    }

    const brand = await this.brandService.findBrandByName(productDto.brandName);
    if (!brand) {
      this.logger.warn(`Brand not found in DB: "${productDto.brandName}"`);
      return {
        product: productDto,
        dataFreshness: 'unavailable',
        message: `Marque "${productDto.brandName}" non référencée dans notre base de données`,
      };
    }

    // Step 4: Fetch company from Pappers (cache-first)
    const company = await this.companyService.getOrCreateCompany(brand.siren);
    if (!company) {
      return {
        product: productDto,
        dataFreshness: 'unavailable',
        message: 'Données entreprise temporairement indisponibles (quota Pappers atteint)',
      };
    }

    const companyDto = this.companyService.toDto(company);

    return {
      product: productDto,
      company: companyDto,
      dataFreshness: 'fresh',
    };
  }
}
