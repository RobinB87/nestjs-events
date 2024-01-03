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
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event-dto';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id) {
    return id;
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    return input;
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {}

  @Delete()
  @HttpCode(204)
  remove(@Param('id') id) {}
}
