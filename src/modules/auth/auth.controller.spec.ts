import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUser } from '../users/dtos/register-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'test_token' }),
    register: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    const result = await authController.register(dto as RegisterUser);

    expect(result).toEqual({ id: 1, email: 'test@example.com' });
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });

  it('should login a user', async () => {
    const mockRequest = { user: { email: 'test@example.com' } };
    const result = await authController.login(mockRequest);

    expect(result).toEqual({ access_token: 'test_token' });
    expect(mockAuthService.login).toHaveBeenCalledWith(mockRequest.user);
  });
});
