import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Raw, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity'; // Asegúrate que la ruta es correcta
import { CrearProductoDto } from './dtos/crear_productos';
import { ActualizarProductoDto } from './dtos/actualizar_producto';
import {
  HistorialMovimiento,
  TipoMovimiento,
} from 'src/historial/entities/historial.entity';

// Si tienes una entidad de usuario, impórtala para usarla en el historial.
// import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class ProductosService {
  async findHistoryByProductId(id: number) {
    // Primero, nos aseguramos de que el producto exista.
    await this.findOne(id);

    // Luego, buscamos todos los movimientos asociados a ese producto.
    return this.historialRepo.find({
      where: { producto: { id } },
      order: { fecha: 'DESC' }, // Es útil ordenar por los más recientes primero.
    });
  }
  constructor(
    @InjectRepository(Producto)
    private productRepo: Repository<Producto>,
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
    // Usamos una transacción para garantizar la atomicidad de la operación.
    // Si falla el guardado del historial, no se actualiza el producto.
    return this.productRepo.manager.transaction(async (transactionalEntityManager) => {
      const productoRepo = transactionalEntityManager.getRepository(Producto);
      const historialRepo =
        transactionalEntityManager.getRepository(HistorialMovimiento);

      const producto = await productoRepo.findOneBy({ id });
      if (!producto) {
        throw new NotFoundException(`Producto con ID #${id} no encontrado`);
      }

      const cantidadAnterior = producto.cantidad;

      // Actualizamos el producto con los nuevos datos del DTO
      productoRepo.merge(producto, dto);

      // Si la cantidad cambió, registramos el movimiento en el historial.
      if (dto.cantidad !== undefined && dto.cantidad !== cantidadAnterior) {
        const diferencia = dto.cantidad - cantidadAnterior;
        const tipo =
          diferencia > 0 ? TipoMovimiento.ENTRADA : TipoMovimiento.SALIDA;

        const movimiento = historialRepo.create({
          producto,
          cantidad: Math.abs(diferencia),
          tipo,
          // Aquí podrías asociar el usuario si tu entidad HistorialMovimiento tiene la relación
          // usuario: { id: userId },
        });
        await historialRepo.save(movimiento);
      }

      // Guardamos el producto actualizado
      await productoRepo.save(producto);
      return producto;
    });
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    // findOne se encargará de lanzar NotFoundException si no existe

    return this.productRepo.remove(producto!);
  }

  /**
   * Este método es una implementación directa de tu código solicitado,
   * adaptado para funcionar dentro de este servicio.
   * Es ideal para un endpoint PATCH que solo modifica el stock.
   */
  async updateStock(id: number, nuevaCantidad: number /*, userId: number */) {
    // La lógica transaccional ya está en el método `update`.
    // Para evitar duplicar código, simplemente llamamos a `update`.
    // El `userId` se pasaría si el método `update` lo soportara.
    return this.update(id, { cantidad: nuevaCantidad });
  }

  async findStockAlerts() {
    // Para comparar dos columnas, usamos Raw de TypeORM.
    // Esto genera una condición SQL como: WHERE "cantidad" <= "cantidadMinima"
    return this.productRepo.find({
      where: {
        cantidad: LessThanOrEqual(Raw(alias => `${alias}.cantidadMinima`)),
      },
    });
  }

  async getDashboardStats() {
    const totalProductos = await this.productRepo.count();
    const stockBajo = await this.findStockAlerts();
    const valorInventario = await this.productRepo
      .createQueryBuilder('producto')
      .select('SUM(producto.precio * producto.cantidad)', 'total')
      .getRawOne();

    return {
      totalProductos,
      productosConStockBajo: stockBajo.length,
      valorTotalInventario: parseFloat(valorInventario.total) || 0,
    };
  }
}
