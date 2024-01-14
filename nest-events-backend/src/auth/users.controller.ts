import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() input: CreateUserDto) {
    const user = await this.userService.create(input);

    return {
      ...user,
      token: this.authService.getTokenForUser(user),
    };
  }
}
