import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import mikroOrmConfig from '../mikro-orm.config';
import { AppService } from './app.service';
import { AppController } from './controllers/app.controller';
import { CompanyModule } from './modules/company/company.module';
import { FundModule } from './modules/fund/fund.module';
import { PersonalityModule } from './modules/personality/personality.module';
import { SectorModule } from './modules/sector/sector.module';

// interface ExpressRequest extends IncomingMessage {
//   originalUrl?: string;
// }

// interface ExpressResponse extends ServerResponse<IncomingMessage> {
//   responseTime?: number;
// }

@Module({
  imports: [
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport: {
    //       target: 'pino-pretty',
    //       options: {
    //         colorize: true,
    //         levelFirst: true,
    //         translateTime: 'yyyy-mm-dd HH:MM:ss',
    //         singleLine: true,
    //         messageFormat: false,
    //         ignore: 'pid,hostname,req,res,context,responseTime',
    //       },
    //     },
    //     autoLogging: true,
    //     serializers: {
    //       req: () => undefined,
    //       res: () => undefined,
    //     },
    //     customReceivedMessage: (req: ExpressRequest) => {
    //       const url = req.originalUrl || req.url || '';
    //       if (url.includes('/docs-json') || url.includes('/docs')) {
    //         return '';
    //       }
    //       return `request received: ${req.method} ${url}`;
    //     },
    //     customLogLevel: (
    //       req: ExpressRequest,
    //       res: ExpressResponse,
    //       error?: Error,
    //     ) => {
    //       if (res.statusCode >= 500 || error) {
    //         return 'error';
    //       } else if (res.statusCode >= 400) {
    //         return 'warn';
    //       }
    //       return 'info';
    //     },
    //     customSuccessMessage: (req: ExpressRequest, res: ExpressResponse) => {
    //       const originalUrl = req.originalUrl || req.url || '';
    //       if (
    //         originalUrl.includes('/docs-json') ||
    //         originalUrl.includes('/docs')
    //       ) {
    //         return '';
    //       }
    //       const method = req.method || '';
    //       const statusCode = res.statusCode;
    //       const responseTime = res.responseTime || 0;
    //       return `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`;
    //     },
    //     customErrorMessage: (req: ExpressRequest, res: ExpressResponse) => {
    //       const originalUrl = req.originalUrl || req.url || '';
    //       if (
    //         originalUrl.includes('/docs-json') ||
    //         originalUrl.includes('/docs')
    //       ) {
    //         return '';
    //       }
    //       const method = req.method || '';
    //       const statusCode = res.statusCode;
    //       const responseTime = res.responseTime || 0;
    //       return `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`;
    //     },
    //   },
    // }),
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      autoLoadEntities: true,
    }),
    CompanyModule,
    FundModule,
    PersonalityModule,
    SectorModule,
    NestConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
