import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/modules/users/user.entity';
import { UserDto } from 'src/modules/users/dtos/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'asdsawqe',
    });
  }

  async validate(payload: any) {
    const { sub } = payload;
    const user = await this.userService.findOne(sub);
    if (!user) throw new NotFoundException('User not found');
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }
}
