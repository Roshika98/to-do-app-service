import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUser } from './dtos/register-user.dto';
import { UpdateUser } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(user: RegisterUser): Promise<User> {
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }

  async findOne(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
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
