import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UserDto } from '../users/dtos/user.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    private userService: UsersService,
  ) {}

  async findAll(user: UserDto | null): Promise<Task[] | null> {
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.find({
      where: { user: user, status: 'PENDING' },
      take: 5,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, taskId: string): Promise<Task | null> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.findOne({ where: { user, id: taskId } });
  }

  async createTask(user: UserDto, attrs: CreateTaskDto): Promise<Task | null> {
    const newTask = this.repo.create({ ...attrs, user });
    return this.repo.save(newTask);
  }

  async updateTask(taskId: string, attrs: UpdateTaskDto): Promise<Task | null> {
    const task = await this.repo.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    Object.assign(task, attrs);
    return this.repo.save(task);
  }

  async deleteTask(taskId: string): Promise<Task | null> {
    const task = await this.repo.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.repo.remove(task);
  }
}
