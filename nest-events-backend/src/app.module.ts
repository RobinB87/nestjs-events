import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Event } from './events/event.entity';
import { EventsController } from './events/events.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'example', // just env..
      database: 'nest-events',
      entities: [Event],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [AppController, EventsController],
  providers: [AppService],
})
export class AppModule {}
