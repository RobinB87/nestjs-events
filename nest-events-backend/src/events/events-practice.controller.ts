import { Controller, Get } from '@nestjs/common';
import { Like, MoreThan, Repository } from 'typeorm';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events-practice')
export class EventsPracticeController {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  @Get()
  practice() {
    return this.repository.find({
      select: ['id', 'when'],
      where: [
        {
          id: MoreThan(1),
        },
        {
          description: Like('%nt5%'),
        },
      ],
      take: 2,
      // skip: ...
      order: { id: 'DESC' },
    });
  }

  @Get('/practice2')
  practice2() {
    // By default only the event is loaded, without the relation
    // add { eager: true } to the entity when you ALWAYS want to load full object, but be careful with this
    return this.repository.findOne({
      where: { id: 1 },
      relations: ['attendees'],
    });
  }
}
