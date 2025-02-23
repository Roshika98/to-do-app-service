import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUser } from './dtos/register-user.dto';
import { UpdateUser } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(user: RegisterUser): Promise<User> {
    try {
      const newUser = this.repo.create(user);
      const result = await this.repo.save(newUser);
      return result;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findOne(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async find(): Promise<User[]> {
    return this.repo.find();
  }

  async update(id: string, attrs: UpdateUser): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
}
