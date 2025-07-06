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
  UseGuards,
} from '@nestjs/common';

import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dtos/crear_productos';
import { ActualizarProductoDto } from './dtos/actualizar_producto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/usuarios/roles/roles.enum';
import { Roles } from 'src/usuarios/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('productos')
export class ProductosController {
    
    

    constructor( private productosService:ProductosService ) {}
    @Roles(Role.ADMIN, Role.EMPLOYEE, Role.CLIENT)
    @Get('/')
    async getAllProducts() {
        return await this.productosService.findAll();
    }
    @Roles(Role.ADMIN, Role.EMPLOYEE, Role.CLIENT)
    @Get(':id')
    async findOne(@Param('id') id: number) {
      let producto = await this.productosService.findOne(id);
      console.log(producto)

      return await this.productosService.findOne(id);
    }
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @Post('/')
    async create(@Body() nuevoProducto: CrearProductoDto) {
      return await this.productosService.create(nuevoProducto);
    }
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @Delete(':id')
    async delete(@Param('id') id: number) {
      return await this.productosService.remove(id);
    }
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() dto: ActualizarProductoDto) {
    return await this.productosService.update(id, dto);
  }
}
