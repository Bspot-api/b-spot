import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import mikroOrmConfig from '../mikro-orm.config';
import { AppService } from './app.service';
import { AppController } from './controllers/app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { BrandModule } from './modules/brand/brand.module';
import { CompanyModule } from './modules/company/company.module';
import { EntityRelationModule } from './modules/entity-relation/entity-relation.module';
import { FundModule } from './modules/fund/fund.module';
import { PersonalityModule } from './modules/personality/personality.module';
import { SectorModule } from './modules/sector/sector.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      autoLoadEntities: true,
    }),
    AuthModule,
    BrandModule,
    CompanyModule,
    EntityRelationModule,
    FundModule,
    PersonalityModule,
    SectorModule,
    NestConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
