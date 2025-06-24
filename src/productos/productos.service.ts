import { Injectable, NotFoundException } from '@nestjs/common';
import { CrearProductoDto } from './dto/crear_productos';
import { ActualizarProductoDto } from './dto/actualizar_producto';

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    cantidad: number;
}
  


@Injectable()
export class ProductosService {
  private productos: Producto[] = [];
  private id = 0;

  create(dto: CrearProductoDto) {
    const product = { id: ++this.id, ...dto };
    this.productos.push(product);
    return product;
  }

  findAll() {
    return this.productos;
  }

  findOne(id: number) {
    const product = this.productos.find(p => p.id === id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  update(id: number, dto: ActualizarProductoDto) {
    const product = this.findOne(id);
    Object.assign(product, dto);
    return product;
  }

  remove(id: number) {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) throw new NotFoundException('Producto no encontrado');
    this.productos.splice(index, 1);
    return { deleted: true };
  }
}