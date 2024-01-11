import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(5)
  username: string;

  @Length(8)
  password: string;

  @Length(8)
  retyptedPassword: string;

  @IsEmail()
  email: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;
}
