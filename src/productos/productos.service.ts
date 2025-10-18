import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CrearProductoDto } from './dtos/crear_productos';
import { ActualizarProductoDto } from './dtos/actualizar_producto';
import { HistorialMovimiento } from 'src/historial/entities/historial.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productRepo: Repository<Producto>,
    // Esta es la dependencia que causa el error en tus pruebas
    @InjectRepository(HistorialMovimiento)
    private historialRepo: Repository<HistorialMovimiento>,
  ) {}

  create(dto: CrearProductoDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  findAll() {
    return this.productRepo.find();
  }

  async findOne(id: number) {
    const producto = await this.productRepo.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`Producto con ID #${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, dto: ActualizarProductoDto) {
    // findOne se encargará de lanzar NotFoundException si no existe
    await this.findOne(id);
    await this.productRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    
    const producto = await this.findOne(id);
    // findOne se encargará de lanzar NotFoundException si no existe

    return this.productRepo.remove(producto!);
  }

  // Métodos que probablemente tienes y que usan el historial (basado en tu controller)
  async getDashboardStats(): Promise<any> {
    // Lógica que usa this.historialRepo...
    return {};
  }

  async findStockAlerts(): Promise<any> {
  return await this.productRepo
    .createQueryBuilder('producto')
    .where('producto.cantidad <= producto.cantidadMinima')
    .getMany();
  }

  async findHistoryByProductId(id: number): Promise<any> {
    return this.historialRepo.find({ where: { producto: { id } as any } });
  }
}
