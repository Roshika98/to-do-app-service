// import { Test, TestingModule } from '@nestjs/testing';
// import { TasksService } from './tasks.service';
// import { UsersService } from '../users/users.service';

// describe('TasksService', () => {
//   let service: TasksService;
//   let userServiceMock: Partial<UsersService>;
//   let taskRepositoryMock;

//   beforeEach(async () => {
//     userServiceMock = {
//       findOne: (id: string) => {
//         return Promise.resolve(null);
//       },
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         TasksService,
//         {
//           provide: UsersService,
//           useValue: userServiceMock,
//         },
//       ],
//     }).compile();

//     service = module.get<TasksService>(TasksService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

describe('TasksService', () => {
  let tasksService: TasksService;
  let usersService: UsersService;
  let taskRepository: Repository<Task>;

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockTaskRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: UsersService, useValue: mockUserService },
        { provide: getRepositoryToken(Task), useValue: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    usersService = module.get<UsersService>(UsersService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  describe('findAll', () => {
    it('should return a list of tasks for the user', async () => {
      const user = { id: '1', email: 'test@example.com' };
      const tasks = [
        { id: '1', status: 'PENDING', user },
        { id: '2', status: 'PENDING', user },
      ];

      mockUserService.findOne.mockResolvedValue(user);
      mockTaskRepository.find.mockResolvedValue(tasks);

      const result = await tasksService.findAll(user);

      expect(result).toEqual(tasks);
      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { user: user, status: 'PENDING' },
        take: 5,
        order: { createdAt: 'DESC' },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const user = { id: '1', email: 'test@example.com' };

      // mockUserService.findOne.mockRejectedValue(null);

      await expect(tasksService.findAll(null)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a task if it exists', async () => {
      const user = { id: '1', email: 'test@example.com' };
      const task = { id: '1', status: 'PENDING', user };
      mockUserService.findOne.mockResolvedValue(user);
      mockTaskRepository.findOne.mockResolvedValue(task);

      const result = await tasksService.findOne(user.id, task.id);

      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = '1';
      const taskId = '1';

      mockUserService.findOne.mockResolvedValue(null);

      await expect(tasksService.findOne(userId, taskId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return null if task is not found', async () => {
      const user = { id: '1', email: 'test@example.com' };
      const taskId = '1';

      mockUserService.findOne.mockResolvedValue(user);
      mockTaskRepository.findOne.mockResolvedValue(null);

      const result = await tasksService.findOne(user.id, taskId);

      expect(result).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const user = { id: '1', email: 'test@example.com' };
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Task description',
        dueDate: new Date(),
      };
      const newTask = { id: '1', ...createTaskDto, user };

      mockTaskRepository.create.mockReturnValue(newTask);
      mockTaskRepository.save.mockResolvedValue(newTask);

      const result = await tasksService.createTask(user, createTaskDto);

      expect(result).toEqual(newTask);
      expect(mockTaskRepository.save).toHaveBeenCalledWith(newTask);
    });
  });

  describe('updateTask', () => {
    it('should update and return the task if found', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        description: 'Updated Description',
        title: 'Updated Title',
        status: 'DONE',
        dueDate: new Date(),
      };
      const existingTask = {
        id: taskId,
        title: 'Title',
        status: 'PENDING',
        description: 'abcd',
      };
      const updatedTask = { ...existingTask, ...updateTaskDto };

      mockTaskRepository.findOne.mockResolvedValue(existingTask);
      mockTaskRepository.save.mockResolvedValue(updatedTask);

      const result = await tasksService.updateTask(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(mockTaskRepository.save).toHaveBeenCalledWith(updatedTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        description: 'Updated Description',
        title: 'Updated Title',
        status: 'DONE',
        dueDate: new Date(),
      };

      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        tasksService.updateTask(taskId, updateTaskDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    it('should delete and return the task if found', async () => {
      const taskId = '1';
      const task = { id: taskId, status: 'PENDING' };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.remove.mockResolvedValue(task);

      const result = await tasksService.deleteTask(taskId);

      expect(result).toEqual(task);
      expect(mockTaskRepository.remove).toHaveBeenCalledWith(task);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const taskId = '1';

      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(tasksService.deleteTask(taskId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
