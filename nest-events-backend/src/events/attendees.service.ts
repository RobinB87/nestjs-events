import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeesRepository: Repository<Attendee>,
  ) {}

  findByEventId(eventId: number): Promise<Attendee[]> {
    return this.attendeesRepository.find({ where: { eventId } });
  }

  findOneByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | undefined> {
    return this.attendeesRepository.findOne({
      where: { event: { id: eventId }, user: { id: userId } },
    });
  }

  async createOrUpdate(
    input: any,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByEventIdAndUserId(eventId, userId)) ?? new Attendee();

    attendee.eventId = eventId;
    attendee.userId = userId;

    return this.attendeesRepository.save(attendee);
  }
}
