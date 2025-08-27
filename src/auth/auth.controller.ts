import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Request } from 'express';
import { CrearUsuarioDto } from 'src/usuarios/dtos/crear_usuario.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.authService.register(crearUsuarioDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    console.log (this.authService.login(req.user));
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    // req.user es poblado por JwtStrategy con el payload del token
    const userProfile = await this.authService.getProfile((req.user as Usuario).id);
    return { success: true, data: userProfile };
  }
}
