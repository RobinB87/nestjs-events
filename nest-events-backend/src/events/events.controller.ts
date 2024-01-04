import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event-dto';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    this.logger.log('Hit the findAll route');
    const events = await this.repository.find();
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.repository.findOneBy({ id: id });
  }

  @Get('/practice')
  practice() {
    return this.repository.find({
      select: ['id', 'when'],
      where: [
        {
          id: MoreThan(3),
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

  @Post()
  create(@Body() input: CreateEventDto) {
    return this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
  ) {
    const event = await this.repository.findOneBy({ id: id });
    const eventForUpdate = {
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    };

    return this.repository.save(eventForUpdate);
  }

  @Delete()
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const event = await this.repository.findOneBy({ id: id });
    this.repository.remove(event);
  }
}
