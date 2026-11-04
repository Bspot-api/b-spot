/**
 * OpenAPI schema generation script.
 * Usage: pnpm generate:openapi  (requires DB to be running: pnpm db:up first)
 *
 * Outputs: apps/api/openapi.json — consumed by mobile to generate typed API client.
 */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function generate(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('B-Spot API')
    .setDescription('B-Spot mobile barcode scanner API — Corporate ownership transparency')
    .setVersion('2.0.0-alpha.1')
    .addTag('scan', 'Product scanning endpoints')
    .addTag('company', 'Company data endpoints')
    .addTag('product', 'Product data endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outputPath = join(__dirname, '..', 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log(`✅ OpenAPI schema written to ${outputPath}`);
  await app.close();
}

generate().catch((err: unknown) => {
  console.error('Failed to generate OpenAPI schema:', err);
  process.exit(1);
});
