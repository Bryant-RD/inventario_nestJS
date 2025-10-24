import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CrearUsuarioDto } from 'src/usuarios/dtos/crear_usuario.dto';
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
    it('should register a new user', async () => {
      const dto: CrearUsuarioDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        company: 'Test Inc.',
      };
      const expectedResult = { id: 1, ...dto, password: 'hashedPassword' };

      mockAuthService.register.mockResolvedValue(expectedResult);

      expect(await controller.register(dto)).toEqual(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return the access token', async () => {
      const user : Omit<Usuario, 'password'> = {
        id: 1, username: 'test', role: Role.EMPLOYEE, // El password no se usa aquí, pero es parte de la entidad
        nombre: '',
        apellido: '',
        correo: 'test@example.com',
        fechaCreacion: new Date(),
      };
      const req: any = { user };
      const tokenAndUser = { access_token: 'jwt-token', user: user };
      mockAuthService.login.mockResolvedValue(tokenAndUser);

      expect(await controller.login(req)).toEqual(tokenAndUser);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });
  });
});
