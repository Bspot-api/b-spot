import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Company } from './company.entity';
import { CompanyService } from './company.service';

@Module({
  imports: [MikroOrmModule.forFeature([Company])],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
