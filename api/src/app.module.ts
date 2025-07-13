import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mikroOrmConfig from '../mikro-orm.config';
import { AppService } from './app.service';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    // Ajoute ici tes modules d'entités/services
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
