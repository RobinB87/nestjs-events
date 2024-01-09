import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { CreateEventDto } from './inputs/create-event.dto';
import { ListEvents } from './inputs/list.events';
import { UpdateEventDto } from './inputs/update-event-dto';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) // trick to populate query classes with defaults when they are not provided
  async findAll(@Query() filter: ListEvents) {
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2,
        },
      );

    this.logger.debug(`Found ${events.total} events`);
    return events;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEvent(id);
    if (!event) throw new NotFoundException();
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
  ) {
    const event = await this.repository.findOneBy({ id: id });
    if (!event) throw new NotFoundException();

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
    const result = await this.eventsService.deleteEvent(id);

    if (result?.affected !== 1) {
      throw new NotFoundException();
    }
  }
}
