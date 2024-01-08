import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 255, { message: 'Name must be at least 5 char' })
  name: string;

  @Length(5, 255)
  description: string;

  @IsDateString()
  when: string;

  @Length(5, 255)
  address: string;
}

// can also use validation groups:
// @Length(5, 255, { groups: ['create'] })
// @Length(10, 20, { groups: ['update'] })

// controller actions then need:
// new ValidationPipe({ groups: ['create'] })

// global validation should be off

// can also use @UsePipes on controller action, or on controller itself
