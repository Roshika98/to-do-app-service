import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RegisterUser } from './dtos/register-user.dto';
import { UpdateUser } from './dtos/update-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: RegisterUser = {
        email: 'test@example.com',
        password: 'password',
        name: 'test user',
      };
      const newUser = { id: '1', ...createUserDto };

      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await usersService.create(createUserDto);

      expect(result).toEqual(newUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: RegisterUser = {
        email: 'test@example.com',
        password: 'password',
        name: 'test user',
      };

      mockUserRepository.save.mockRejectedValueOnce(
        new Error('User already exists'),
      );

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await usersService.findOne('1');

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await usersService.findOne('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if email is found', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await usersService.findOneByEmail('test@example.com');

      expect(result).toEqual(user);
    });

    it('should return null if email is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await usersService.findOneByEmail(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: '1', email: 'test@example.com', password: 'hashedPassword' },
        { id: '2', email: 'test2@example.com', password: 'hashedPassword' },
      ];

      mockUserRepository.find.mockResolvedValue(users);

      const result = await usersService.find();

      expect(result).toEqual(users);
    });
  });

  describe('update', () => {
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

      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await usersService.update(
        '1',
        updateUserDto as UpdateUser,
      );

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const updateUserDto: Partial<UpdateUser> = {
        email: 'updated@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        usersService.update('nonexistent-id', updateUserDto as UpdateUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
