import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from '../usuarios/roles/roles.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  // Función helper para crear un mock de ExecutionContext
  const createMockExecutionContext = (user: any, requiredRoles: Role[]): ExecutionContext => {
    const mockGetRequest = jest.fn(() => ({ user }));
    const mockGetHandler = jest.fn();
    const mockGetClass = jest.fn();
    
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

    return {
      switchToHttp: () => ({ getRequest: mockGetRequest }),
      getHandler: mockGetHandler,
      getClass: mockGetClass,
    } as any;
  };

  it('should allow access if no roles are required', () => {
    const context = createMockExecutionContext({ role: Role.CLIENT }, []);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has the required role', () => {
    const user = { role: Role.ADMIN };
    const requiredRoles = [Role.ADMIN, Role.EMPLOYEE];
    const context = createMockExecutionContext(user, requiredRoles);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user does not have the required role', () => {
    const user = { role: Role.CLIENT };
    const requiredRoles = [Role.ADMIN, Role.EMPLOYEE];
    const context = createMockExecutionContext(user, requiredRoles);
    
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user is not defined', () => {
    const user = null;
    const requiredRoles = [Role.ADMIN];
    const context = createMockExecutionContext(user, requiredRoles);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});