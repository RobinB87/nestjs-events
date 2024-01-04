import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event-dto';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  @Get()
  findAll() {
    return this.repository.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repository.findOneBy({ id: +id });
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    return this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const event = await this.findOne(id);
    const eventForUpdate = {
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    };

    return this.repository.save(eventForUpdate);
  }

  @Delete()
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const event = await this.repository.findOneBy({ id: +id });
    this.repository.remove(event);
  }
}
