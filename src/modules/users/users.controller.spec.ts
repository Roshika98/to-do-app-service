import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUser } from './dtos/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: '1', email: 'test@example.com', password: 'hashedPassword' },
        { id: '2', email: 'test2@example.com', password: 'hashedPassword' },
      ];
      mockUsersService.find.mockResolvedValue(users);

      const result = await usersController.getUsers();
      expect(result).toEqual(users);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await usersController.getUser('1');
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(
        usersController.getUser('nonexistent-id'),
      ).resolves.toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update and return the user if found', async () => {
      const updateUserDto: Partial<UpdateUser> = {
        email: 'updated@example.com',
      };
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const updatedUser = { ...user, ...updateUserDto };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await usersController.updateUser(
        '1',
        updateUserDto as UpdateUser,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const updateUserDto: Partial<UpdateUser> = {
        email: 'updated@example.com',
      };
      mockUsersService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        usersController.updateUser(
          'nonexistent-id',
          updateUserDto as UpdateUser,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
