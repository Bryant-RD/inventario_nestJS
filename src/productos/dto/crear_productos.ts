import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CrearProductoDto {
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