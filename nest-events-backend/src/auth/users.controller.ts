import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() input: CreateUserDto) {
    if (input.password !== input.retyptedPassword)
      throw new BadRequestException(['Passwords are NOT identical']);

    const existingUser = await this.userRepository.findOne({
      where: [{ username: input.username }, { email: input.email }], // OR
    });

    if (existingUser)
      throw new BadRequestException(['Username OR email is already used']);

    const user = new User();
    user.username = input.username;
    user.password = await this.authService.hashPassword(input.password);
    user.email = input.email;
    user.firstName = input.firstName;
    user.lastName = input.lastName;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }
}
