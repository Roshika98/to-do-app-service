import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { RegisterUser } from '../users/dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   @Post('login')
  //   @UseGuards(LocalAuthGuard)
  //   async login() {
  //     return this.authService.login();
  //   }

  @Post('register')
  async register(@Body() attrs: RegisterUser) {
    return this.authService.register(attrs);
  }
}
