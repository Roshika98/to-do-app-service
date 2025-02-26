import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    jwtAuthGuard = new JwtAuthGuard(reflector);
  });

  it('should allow access if route is public', () => {
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    expect(jwtAuthGuard.canActivate(context)).toBe(true);
  });

  it('should call super.canActivate for protected routes', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer test' } }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const result = jwtAuthGuard.canActivate(context);
    expect(result).toBeInstanceOf(Promise); // Since `super.canActivate()` is async
  });
});
