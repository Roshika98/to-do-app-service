import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserDto } from '../users/dtos/user.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@CurrentUser() user: UserDto) {
    return this.taskService.findAll(user);
  }

  @Post()
  createTask(@CurrentUser() user: UserDto, @Body() attrs: CreateTaskDto) {
    return this.taskService.createTask(user, attrs);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() attrs: UpdateTaskDto) {
    return this.taskService.updateTask(id, attrs);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
