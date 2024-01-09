import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateOptions, paginate } from 'src/pagination/paginator';
import { DeleteResult, Repository } from 'typeorm';
import { Event } from './event.entity';
import { ListEvents, WhenEventFilter } from './inputs/list.events';
import { CreateEventDto } from './inputs/create-event.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  private getEventsWithAttendeeCountFilteredQuery(filter?: ListEvents) {
    let query = this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= now() AND e.when <= now() + interval '1 day'`,
        );
      }

      if (filter.when == WhenEventFilter.Tomorrow) {
        query = query.andWhere(
          `e.when >= now() + interval '1 day' AND e.when <= now() + interval '2 day'`,
        );
      }

      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere(
          `date_part('week', e.when) = date_part('week', now())`,
        );
      }

      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere(
          `date_part('week', e.when) = date_part('week', now()) + 1`,
        );
      }
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFilteredQuery(filter),
      paginateOptions,
    );
  }

  public async getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { id },
    );

    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  private getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery().loadRelationCountAndMap(
      'e.attendeeCount',
      'e.attendees',
    );
  }

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    return this.eventsRepository.save({
      ...input,
      when: new Date(input.when),
      organizer: user,
    });
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
