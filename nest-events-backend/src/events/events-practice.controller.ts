import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { Event } from './event.entity';

@Controller('/events-practice')
export class EventsPracticeController {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
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

  @Get('/practice3')
  async practice3() {
    // EXAMPLE 1
    // const event = await this.repository.findOne({ where: { id: 1 } });

    // EXAMPLE 2
    const event = new Event();
    event.id = 1;

    const attendee = new Attendee();
    attendee.name = 'Johnnyboy the 2nd';
    attendee.event = event;

    await this.attendeeRepository.save(attendee);

    return event;
  }

  @Get('/practice4')
  async practice4() {
    // EXAMPLE 3 - using cascade
    // SET { cascade: true } or { cascade: [ "insert", "update" ]} to the @OneToMany entity (Event)
    // BE careful when using this, because you could for example remove all attendees for an event
    const event = await this.repository.findOne({
      where: { id: 1 },
      relations: ['attendees'],
    });

    const attendee = new Attendee();
    attendee.name = 'Using Cascade';

    event.attendees.push(attendee);
    await this.repository.save(event);
  }

  // example of using query builder for updating
  // when updating 100 or 1000's of records, using querybuilder is better than defaults
  // @Get('bla')
  // async bla() {
  //   await this.attendeeRepository
  //     .createQueryBuilder('s')
  //     .update()
  //     .set({ name: 'Confidential' })
  //     .execute();
  // }
}
