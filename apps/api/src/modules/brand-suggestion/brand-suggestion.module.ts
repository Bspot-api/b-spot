import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BrandSuggestion } from './brand-suggestion.entity';
import { BrandSuggestionController } from './brand-suggestion.controller';
import { BrandSuggestionService } from './brand-suggestion.service';

@Module({
  imports: [MikroOrmModule.forFeature([BrandSuggestion])],
  providers: [BrandSuggestionService],
  controllers: [BrandSuggestionController],
  exports: [BrandSuggestionService],
})
export class BrandSuggestionModule {}
