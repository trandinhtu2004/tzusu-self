import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.FRONTEND_URL ?? 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException({
          message: 'Validation failed',
          errors: errors.flatMap((error) =>
            Object.values(error.constraints ?? {}),
          ),
        }),
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tzusu Self API')
    .setDescription('API documentation for the realtime chat backend')
    .setVersion('1.0')
    .build();
  const swaggerDocumentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocumentFactory, {
    customSiteTitle: 'Tzusu Self API Docs',
  });

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);

  console.log(`API is running on http://localhost:${port}`);
  console.log(`Swagger docs are running on http://localhost:${port}/api/docs`);
}
bootstrap();
