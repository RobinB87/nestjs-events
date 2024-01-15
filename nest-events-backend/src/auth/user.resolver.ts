import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuardJwtGql } from './auth-guard-jwt-gql';
import { CurrentUser } from './current-user.decorator';
import { CreateUserDto } from './input/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql) // ensure user is authenticated
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => User, { name: 'userAdd' })
  add(@Args('input') input: CreateUserDto): Promise<User> {
    return this.userService.create(input);
  }
}
