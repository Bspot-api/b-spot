import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    const weakSecrets = ['your-secret-key', 'your-secret-key-here-at-least-32-characters', 'your-better-auth-secret', 'your-better-auth-secret-at-least-32-characters'];

    if (!process.env.JWT_SECRET || weakSecrets.includes(process.env.JWT_SECRET)) {
      throw new Error(
        '🔒 SECURITY ERROR: JWT_SECRET must be changed in production!\n' +
        'Generate a secure secret with: openssl rand -base64 32'
      );
    }

    if (!process.env.BETTER_AUTH_SECRET || weakSecrets.includes(process.env.BETTER_AUTH_SECRET)) {
      throw new Error(
        '🔒 SECURITY ERROR: BETTER_AUTH_SECRET must be changed in production!\n' +
        'Generate a secure secret with: openssl rand -base64 32'
      );
    }
  }

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Configuration CORS
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173'];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('b-spot API')
    .setDescription(
      'API pour la plateforme de référencement des entreprises liées aux médias',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Expose OpenAPI JSON for type generation
  app.use('/api-json', (_req: Request, res: Response) => {
    res.json(document);
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}
bootstrap();
