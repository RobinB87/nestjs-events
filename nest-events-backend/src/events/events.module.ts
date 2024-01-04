import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { EventsController } from './events.controller';
import { Attendee } from './attendee.entity';
import { EventsPracticeController } from './events-practice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController, EventsPracticeController],
})
export class EventsModule {}
