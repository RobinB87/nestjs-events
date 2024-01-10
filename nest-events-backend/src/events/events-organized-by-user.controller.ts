import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', ParseIntPipe) page = 1,
  ) {
    return this.eventsService.getEventsOrganizedByUserIdPaginated(userId, {
      currentPage: page,
      limit: 5,
    });
  }
}
