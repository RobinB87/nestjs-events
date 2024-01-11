import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { EventsService } from './events.service';
import { CreateEventDto } from './inputs/create-event.dto';
import { ListEvents } from './inputs/list.events';
import { UpdateEventDto } from './inputs/update-event-dto';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) // trick to populate query classes with defaults when they are not provided
  @UseInterceptors(ClassSerializerInterceptor)
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
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEventWithAttendeeCount(id);
    if (!event) throw new NotFoundException();
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.findOne(id);
    if (!event) throw new NotFoundException();
    if (event.organizerId !== user.id)
      throw new ForbiddenException(
        null,
        'You are not authorized to update this event',
      );

    return await this.eventsService.updateEvent(event, input);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.findOne(id);
    if (!event) throw new NotFoundException();
    if (event.organizerId !== user.id)
      throw new ForbiddenException(
        null,
        'You are not authorized to remove this event',
      );

    await this.eventsService.deleteEvent(id);

    // NOT required anymore, the custom delete query was to save another trip to the db, but is now not really possible because user check required first..
    // if (result?.affected !== 1) {
    //   throw new NotFoundException();
    // }
  }
}
