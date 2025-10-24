import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Request } from 'express';
import { CrearUsuarioDto } from 'src/usuarios/dtos/crear_usuario.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { JwtPayload } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() crearUsuarioDto: CrearUsuarioDto) {
      console.error('DTO recibido:', crearUsuarioDto);
    return this.authService.register(crearUsuarioDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    // req.user es poblado por LocalAuthGuard con el usuario validado (sin password)
    const loggedInUser = req.user as Omit<Usuario, 'password'>;
    const result = await this.authService.login(loggedInUser);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    // req.user es poblado por JwtStrategy con el payload del token
    const userProfile = await this.authService.getProfile((req.user as JwtPayload).id);
    return { success: true, data: userProfile };
  }
}
