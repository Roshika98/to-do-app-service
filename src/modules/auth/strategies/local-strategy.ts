import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
