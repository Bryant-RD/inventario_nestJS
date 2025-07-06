import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/usuarios/roles/roles.enum';

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
      const username = 'newUser';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';
      const userDto = { username, password, role: Role.EMPLOYEE };
      const savedUser = { id: 1, ...userDto, password: hashedPassword };

      mockUserRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepo.create.mockReturnValue(userDto);
      mockUserRepo.save.mockResolvedValue(savedUser);

      const result = await service.register(username, password);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockUserRepo.create).toHaveBeenCalledWith({ username, password: hashedPassword, role: Role.EMPLOYEE });
      expect(mockUserRepo.save).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(savedUser);
    });

    it('should throw ConflictException if username already exists', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, username: 'existingUser' });
      await expect(service.register('existingUser', 'pass')).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user object without password if credentials are valid', async () => {
      const user = { id: 1, username: 'test', password: 'hashedPassword', role: Role.ADMIN };
      mockUserRepo.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { password, ...expectedResult } = user;
      const result = await service.validateUser('test', 'password');

      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.validateUser('unknown', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = { id: 1, username: 'test', password: 'hashedPassword', role: Role.ADMIN };
      mockUserRepo.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simula contraseña incorrecta

      await expect(service.validateUser('test', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: 1, username: 'test', role: Role.EMPLOYEE };
      const token = 'jwt-token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ username: user.username, sub: user.id, role: user.role });
      expect(result).toEqual({ access_token: token });
    });
  });
});