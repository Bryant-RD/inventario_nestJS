import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.service'; // Importar JwtPayload desde auth.service

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtSecretKey', // usa dotenv para producción
    });
  }

  validate(payload: JwtPayload) {
    return { id: payload.id, email: payload.email, role: payload.role }; // Usar payload.id
  }
}
