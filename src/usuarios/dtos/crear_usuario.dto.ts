import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { Role } from '../roles/roles.enum';

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;


  @IsString()
  @IsNotEmpty({ message: 'El username es requerido' })
  @MinLength(6, { message: 'El username debe tener al menos 6 caracteres' })
  username: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsOptional()
  role?: Role;


  
}