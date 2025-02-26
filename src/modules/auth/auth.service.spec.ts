import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUser } from '../users/dtos/register-user.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockBcrypt = {
    compare: jest.fn(),
    hash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      // .overrideProvider(bcrypt)
      // .useValue(mockBcrypt)
      .compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // it('should be defined', () => {
  //   expect(authService).toBeDefined();
  // });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUserService.findOneByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@example.com',
        'hashedPassword',
      );
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistent@example.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUserService.findOneByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        'test@example.com',
        'wrongPassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: 1, email: 'test@example.com' };
      const payload = { sub: user.id, email: user.email };
      mockJwtService.sign.mockReturnValue('access_token');

      const result = await authService.login(user);
      expect(result).toEqual({ access_token: 'access_token' });
    });
  });

  describe('register', () => {
    it('should return a new user with hashed password', async () => {
      const registerUser: RegisterUser = {
        email: 'test@example.com',
        password: 'plainPassword',
        name: 'testuser',
      };
      const hashedPassword = 'hashedPassword';
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserService.create.mockResolvedValue({
        ...registerUser,
        password: hashedPassword,
      });

      const result = await authService.register(registerUser);
      expect(result!.password).toBe(hashedPassword);
      expect(result!.email).toBe(registerUser.email);
    });

    it('should handle errors during registration', async () => {
      const registerUser: RegisterUser = {
        email: 'test@example.com',
        password: 'plainPassword',
        name: 'testuser',
      };
      mockBcrypt.hash.mockRejectedValue(new Error('Error hashing password'));
      mockUserService.create.mockResolvedValue(undefined);

      const result = await authService.register(registerUser);
      expect(result).toBeUndefined();
    });
  });
});
