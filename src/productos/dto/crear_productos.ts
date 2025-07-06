import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

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

  @IsNumber()
  cantidadMinima: number;

  @IsNumber()
  proveedorId?: number;
}