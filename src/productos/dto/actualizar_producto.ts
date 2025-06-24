import { IsString, IsNumber, IsNotEmpty, isString } from 'class-validator';

export class ActualizarProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  cantidad: number;
}