import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suplidor } from './entities/suplidor.entity';
import { CrearSuplidorDto } from './dtos/crear-suplidor.dto';
import { ActualizarSuplidorDto } from './dtos/actualizar-suplidor.dto';


@Injectable()
export class SuplidoresService {
  constructor(
    @InjectRepository(Suplidor)
    private suplidorRepo: Repository<Suplidor>,
  ) {}

  create(dto: CrearSuplidorDto) {
    const suplidor = this.suplidorRepo.create(dto);
    return this.suplidorRepo.save(suplidor);
  }

  findAll() {
    return this.suplidorRepo.find();
  }

  async findOne(id: number) {
    const suplidor = await this.suplidorRepo.findOne({
      where: { id },
      relations: ['productos'], // Cargar productos relacionados
    });
    if (!suplidor) {
      throw new NotFoundException(`suplidor con ID #${id} no encontrado`);
    }
    return suplidor;
  }

  async update(id: number, dto: ActualizarSuplidorDto) {
    const suplidor = await this.findOne(id); // Reutiliza findOne para verificar existencia
    this.suplidorRepo.merge(suplidor, dto);
    return this.suplidorRepo.save(suplidor);
  }

  async remove(id: number) {
    const suplidor = await this.findOne(id);
    return this.suplidorRepo.remove(suplidor);
  }
}