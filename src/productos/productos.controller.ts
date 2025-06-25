import {
  Controller,
  Delete,
  Patch,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
} from '@nestjs/common';

import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear_productos';
import { ActualizarProductoDto } from './dto/actualizar_producto';
import { IsNull } from 'typeorm';

@Controller('productos')
export class ProductosController {
    
    

    constructor( private productosService:ProductosService ) {}

    @Get('/')
    async getAllProducts() {
        return await this.productosService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
      let producto = await this.productosService.findOne(id);
      console.log(producto)
      // if (producto == null) {
      //   return 
      // }
      return await this.productosService.findOne(id);
    }

    @Post('/')
    async create(@Body() nuevoProducto: CrearProductoDto) {
      return await this.productosService.create(nuevoProducto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
      return await this.productosService.remove(id);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() dto: ActualizarProductoDto) {
    return await this.productosService.update(id, dto);
  }
}
