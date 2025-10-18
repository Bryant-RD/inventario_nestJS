import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload { userId: number; email: string; role: string; }
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtSecretKey', // usa dotenv para producción
    });
  }

  validate(payload: JwtPayload) {
    return { id: payload.userId, email: payload.email, role: payload.role };
  }
}
