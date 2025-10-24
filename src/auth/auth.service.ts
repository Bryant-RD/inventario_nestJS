import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CrearUsuarioDto } from 'src/usuarios/dtos/crear_usuario.dto';

// Interfaz para definir la estructura del payload del JWT
export interface JwtPayload {
  id: number; // Cambiado de userId a id para consistencia con la entidad Usuario
  email: string;
  role: string;
}


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

async register(usuarioDTO : CrearUsuarioDto) {
  console.log('DTO recibido:', usuarioDTO);


  const existing = await this.userRepo.findOne({
    where: [
      { username: usuarioDTO.username },
      { correo: usuarioDTO.email },
    ],
  });
  if (existing) {
    throw new ConflictException('El nombre de usuario o el correo electrónico ya existe');
  }
  const hashed = await bcrypt.hash(usuarioDTO.password, 10);

  const user = this.userRepo.create({
    nombre: usuarioDTO.firstName,
    apellido: usuarioDTO.lastName,
    correo: usuarioDTO.email,
    username: usuarioDTO.username,
    password: hashed,
    empresa: usuarioDTO.company,
    role: usuarioDTO.role,
  });
  return this.userRepo.save(user);
}

  async validateUser(email: string, pass: string): Promise<Omit<Usuario, 'password'>> {
    const user = await this.userRepo.findOne({ where: { correo: email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      // Este caso no debería ocurrir si el token es válido, pero es una buena práctica manejarlo.
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: Omit<Usuario, 'password'>) {
    const payload: JwtPayload = { id: user.id, email: user.correo, role: user.role };
    const access_token = await this.jwtService.sign(payload);
    return {
      access_token,
      user, // Devolvemos el objeto de usuario sin la contraseña
    };
  }
}