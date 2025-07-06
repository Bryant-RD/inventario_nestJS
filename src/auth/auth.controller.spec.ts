import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Role } from 'src/usuarios/roles/roles.enum';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it.each([
      {
        description: 'an EMPLOYEE user',
        dto: { username: 'test', password: 'pass' },
        expectedResult: { id: 1, username: 'test', role: Role.EMPLOYEE, password: 'hashedPassword' },
      },
      {
        description: 'a CLIENT user',
        dto: { username: 'cliente', password: '123456' },
        expectedResult: { id: 2, username: 'cliente', role: Role.CLIENT, password: 'hashedPassword' },
      },
    ])('should register $description', async ({ dto, expectedResult }) => {
      mockAuthService.register.mockResolvedValue(expectedResult);

      expect(await controller.register(dto)).toEqual(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto.username, dto.password);
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return the access token', async () => {
      const user : Usuario = { id: 1, username: 'test', role: Role.EMPLOYEE, password: 'pass' };
      const req: any = { user };
      const token = { access_token: 'jwt-token' };
      mockAuthService.login.mockResolvedValue(token);

      expect(await controller.login(req)).toEqual(token);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });
  });
});
