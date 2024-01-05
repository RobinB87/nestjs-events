import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { Attendee } from './attendee.entity';
import { EventsPracticeController } from './events-practice.controller';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController, EventsPracticeController],
  providers: [EventsService],
})
export class EventsModule {}
