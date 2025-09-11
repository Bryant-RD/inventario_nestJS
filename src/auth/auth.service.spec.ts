import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/usuarios/roles/roles.enum';
import { CrearUsuarioDto } from 'src/usuarios/dtos/crear_usuario.dto';

// Mockeamos la librería bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<Usuario>;
  let jwtService: JwtService;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUserRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash the password and save a new user', async () => {
      const userDto: CrearUsuarioDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        company: 'Test Inc.',
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = {
        nombre: userDto.firstName,
        apellido: userDto.lastName,
        correo: userDto.email,
        username: userDto.username,
        password: hashedPassword,
        empresa: userDto.company,
      };
      const savedUser = { id: 1, ...createdUser };

      mockUserRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepo.create.mockReturnValue(createdUser as Usuario);
      mockUserRepo.save.mockResolvedValue(savedUser);

      const result = await service.register(userDto);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: [{ username: userDto.username }, { correo: userDto.email }],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, 10);
      expect(mockUserRepo.create).toHaveBeenCalledWith(createdUser);
      expect(mockUserRepo.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(savedUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      const userDto: CrearUsuarioDto = {
        firstName: 'Existing', lastName: 'User', email: 'existing@example.com',
        username: 'existinguser', password: 'password123', company: 'Test Inc.',
      };
      mockUserRepo.findOne.mockResolvedValue({ id: 1 } as Usuario);

      await expect(service.register(userDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user object without password if credentials are valid', async () => {
      const user = { id: 1, correo: 'test@example.com', password: 'hashedPassword', role: Role.ADMIN };
      mockUserRepo.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { password, ...expectedResult } = user;
      const result = await service.validateUser('test@example.com', 'password');

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { correo: 'test@example.com' } });
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.validateUser('unknown@example.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = { id: 1, correo: 'test@example.com', password: 'hashedPassword', role: Role.ADMIN };
      mockUserRepo.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simula contraseña incorrecta

      await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: 1, correo: 'test@example.com', role: Role.EMPLOYEE };
      const token = 'jwt-token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: user.correo, sub: user.id, role: user.role });
      expect(result).toEqual({ access_token: token });
    });
  });
});