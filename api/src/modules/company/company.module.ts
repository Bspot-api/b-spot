import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { EntityRelationModule } from '../entity-relation/entity-relation.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Company]),
    EntityRelationModule,
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
