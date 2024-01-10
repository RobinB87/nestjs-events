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
}
