import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import configmodule in child modules
      load: [ormConfig],
      expandVariables: true,
      // ignoreEnvFile: true, // when you want to ignore env files because stuff comes from e.g. docker
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      // allows registering a config async
      useFactory:
        process.env.NODE_ENV === 'production' ? ormConfigProd : ormConfig,
    }),
    AuthModule,
    EventsModule,
  ],
})
export class AppModule {}
