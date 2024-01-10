import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { Attendee } from './attendee.entity';
import { AttendeesService } from './attendees.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventAttendeesController } from './event-attendees.controller';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { EventsPracticeController } from './events-practice.controller';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee, Event])], // User ??
  controllers: [
    CurrentUserEventAttendanceController,
    EventAttendeesController,
    EventsController,
    EventsOrganizedByUserController,
    EventsPracticeController,
  ],
  providers: [AttendeesService, EventsService],
})
export class EventsModule {}
