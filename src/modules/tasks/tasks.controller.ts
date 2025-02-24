import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserDto } from '../users/dtos/user.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@CurrentUser() user: UserDto) {
    // console.log(user);
    return this.taskService.findAll(user.id);
  }
}
