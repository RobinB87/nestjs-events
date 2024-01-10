import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { Attendee } from './attendee.entity';
import { AttendeesService } from './attendees.service';
import { EventsPracticeController } from './events-practice.controller';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee, Event])],
  controllers: [EventsController, EventsPracticeController],
  providers: [AttendeesService, EventsService],
})
export class EventsModule {}
