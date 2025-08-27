import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Role } from 'src/usuarios/roles/roles.enum';
import { CrearUsuarioDto } from 'src/usuarios/dtos/crear_usuario.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

async register(usuarioDTO : CrearUsuarioDto) {
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

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { correo: email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
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
    const { password, ...result } = user;
    return result;
  }

async login(user: any) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  return {
    access_token: this.jwtService.sign(payload),
  };
}
}
