import { IsEmail, Length } from 'class-validator';
import { IsRepeated } from '../../validation/is-repeated.constraint';

export class CreateUserDto {
  @Length(5)
  username: string;

  @Length(8)
  password: string;

  @IsRepeated('password')
  retypedPassword: string;

  @IsEmail()
  email: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;
}
