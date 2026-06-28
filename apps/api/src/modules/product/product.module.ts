import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Product } from './product.entity';
import { Brand } from '../brand/brand.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Product, Brand])],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
