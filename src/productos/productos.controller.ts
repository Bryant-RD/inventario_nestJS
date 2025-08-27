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
  ParseIntPipe,
} from '@nestjs/common';

import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dtos/crear_productos';
import { ActualizarProductoDto } from './dtos/actualizar_producto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/usuarios/roles/roles.enum';
import { Roles } from 'src/usuarios/roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('productos')
export class ProductosController {
    
    
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @Get('/stats/dashboard')
    async getDashboardData() {
      return await this.productosService.getDashboardStats();
    }

    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @Get('/stock/alerts')
    async getStockAlerts() {
      return await this.productosService.findStockAlerts();
    }


    constructor( private productosService:ProductosService ) {}
    @Roles(Role.ADMIN, Role.EMPLOYEE, Role.CLIENT)
    @Get('/')
    async getAllProducts() {
        return await this.productosService.findAll();
    }
    @Roles(Role.ADMIN, Role.EMPLOYEE, Role.CLIENT)
    @Get(':id')
    async findOne(@Param('id') id: number) {
      const producto = await this.productosService.findOne(id);
      console.log(producto); // Se mantiene el log por si es para depuración
      return producto;
    }
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @Post('/')
    async create(@Body() nuevoProducto: CrearProductoDto) {
      console.log(nuevoProducto);
      return await this.productosService.create(nuevoProducto);
    }
    @Roles(Role.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: number) {
      return await this.productosService.remove(id);
    }
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() dto: ActualizarProductoDto) {
    return await this.productosService.update(id, dto);
  }


  // En tu controlador de productos...
@Get(':id/history')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.EMPLOYEE) // Solo Admin y Empleado pueden ver el historial
async getProductHistory(@Param('id', ParseIntPipe) id: number) {
  return this.productosService.findHistoryByProductId(id);
}
  
}
