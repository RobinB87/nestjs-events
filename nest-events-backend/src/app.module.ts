import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import configmodule in child modules
      load: [ormConfig],
      expandVariables: true,
      // ignoreEnvFile: true, // when you want to ignore env files because stuff comes from e.g. docker
      // envFilePath: when you want a different name / path for the .env
    }),
    TypeOrmModule.forRootAsync({
      // allows registering a config async
      useFactory:
        process.env.NODE_ENV === 'production' ? ormConfigProd : ormConfig,
    }),
    EventsModule,
  ],
})
export class AppModule {}
