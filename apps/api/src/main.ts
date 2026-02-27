import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for mobile app access
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Global validation pipe with Zod
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('B-Spot API')
    .setDescription('B-Spot mobile barcode scanner API - Corporate ownership transparency platform')
    .setVersion('2.0.0-alpha.1')
    .addTag('health', 'Health check endpoints')
    .addTag('scan', 'Product scanning endpoints')
    .addTag('company', 'Company data endpoints')
    .addTag('product', 'Product data endpoints')
    .addTag('brand', 'Brand mapping endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 B-Spot API running on: http://localhost:${port}`);
  console.log(`📚 API documentation: http://localhost:${port}/api`);
}

bootstrap();
