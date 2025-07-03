import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Role } from 'src/usuarios/roles/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

async register(username: string, password: string, role = Role.EMPLOYEE) {
  const existing = await this.userRepo.findOne({ where: { username } });
  if (existing) {
    throw new Error('El nombre de usuario ya existe');
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = this.userRepo.create({ username, password: hashed, role });
  return this.userRepo.save(user);
}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
