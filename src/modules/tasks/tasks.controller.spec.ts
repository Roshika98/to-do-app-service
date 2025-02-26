import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UserDto } from '../users/dtos/user.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { CreateTaskDto } from './dtos/create-task.dto';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  const mockUser: UserDto = { id: 'user-id', email: 'test@example.com' };
  const mockTasksService = {
    findAll: jest.fn().mockResolvedValue([]),
    createTask: jest
      .fn()
      .mockResolvedValue({ id: 'task-id', title: 'Test Task' }),
    updateTask: jest
      .fn()
      .mockResolvedValue({ id: 'task-id', title: 'Updated Task' }),
    deleteTask: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should get all tasks', async () => {
    await expect(tasksController.getTasks(mockUser)).resolves.toEqual([]);
    expect(mockTasksService.findAll).toHaveBeenCalledWith(mockUser);
  });

  it('should create a task', async () => {
    const dto = { title: 'Test Task' };
    await expect(
      tasksController.createTask(mockUser, dto as CreateTaskDto),
    ).resolves.toEqual({
      id: 'task-id',
      title: 'Test Task',
    });
    expect(mockTasksService.createTask).toHaveBeenCalledWith(mockUser, dto);
  });

  it('should update a task', async () => {
    const dto = { title: 'Updated Task' };
    await expect(
      tasksController.updateTask('task-id', dto as UpdateTaskDto),
    ).resolves.toEqual({
      id: 'task-id',
      title: 'Updated Task',
    });
    expect(mockTasksService.updateTask).toHaveBeenCalledWith('task-id', dto);
  });

  it('should delete a task', async () => {
    await expect(tasksController.deleteTask('task-id')).resolves.toEqual(true);
    expect(mockTasksService.deleteTask).toHaveBeenCalledWith('task-id');
  });
});
