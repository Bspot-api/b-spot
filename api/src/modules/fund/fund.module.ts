import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
// import { CompanyModule } from '../company/company.module';
import { FundController } from './fund.controller';
import { Fund } from './fund.entity';
import { FundService } from './fund.service';

@Module({
  imports: [MikroOrmModule.forFeature([Fund])],
  providers: [FundService],
  controllers: [FundController],
})
export class FundModule {}
