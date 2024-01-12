import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EntityNotFoundErrorFilter } from './entity-not-found-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // { logger: ['error', 'warn', 'debug'] } // can set specific log levels
  );
  app.useGlobalPipes(new ValidationPipe()); // can also be put in the body of a controller action: @Body(ValidationPipe)
  app.useGlobalFilters(new EntityNotFoundErrorFilter());
  await app.listen(3000);
}
bootstrap();
