import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CrearProductoDto } from './dto/crear_productos';
import { ActualizarProductoDto } from './dto/actualizar_producto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productRepo: Repository<Producto>,
  ) {}

  create(dto: CrearProductoDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  findAll() {
    return this.productRepo.find();
  }

  findOne(id: number) {
    return this.productRepo.findOneBy({ id });
  }

  async update(id: number, dto: ActualizarProductoDto) {
    await this.productRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    
    const producto = await this.productRepo.findOneBy({id});

    return this.productRepo.remove(producto!);
  }
}
