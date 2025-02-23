import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUser } from '../users/dtos/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByEmail(username);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return null;
      }
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterUser) {
    try {
      const { password } = user;
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      const newUser = this.userService.create(user);
      return newUser;
    } catch (error) {
      console.dir(error, { depth: null });
    }
  }
}
