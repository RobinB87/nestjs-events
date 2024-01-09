import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(AuthGuard('local')) // calls validate method
  async login(@Request() request) {
    return {
      userId: request.user.id,
      token: 'token will go here..',
    };
  }
}
