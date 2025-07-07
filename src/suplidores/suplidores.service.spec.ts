import { Test, TestingModule } from '@nestjs/testing';
import { SuplidoresService } from './suplidores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Suplidor } from './entities/suplidor.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CrearSuplidorDto } from './dtos/crear-suplidor.dto';
import { ActualizarSuplidorDto } from './dtos/actualizar-suplidor.dto';

describe('SuplidoresService', () => {
  let service: SuplidoresService;
  let repository: Repository<Suplidor>;

  const mockSuplidorRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuplidoresService,
        {
          provide: getRepositoryToken(Suplidor),
          useValue: mockSuplidorRepository,
        },
      ],
    }).compile();

    service = module.get<SuplidoresService>(SuplidoresService);
    repository = module.get<Repository<Suplidor>>(getRepositoryToken(Suplidor));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new suplidor', async () => {
      const dto: CrearSuplidorDto = {
        nombre: 'Suplidor Test',
        contacto: 'Contacto Test',
        telefono: '123456789',
      };
      const suplidor = { id: 1, ...dto };

      mockSuplidorRepository.create.mockReturnValue(dto);
      mockSuplidorRepository.save.mockResolvedValue(suplidor);

      expect(await service.create(dto)).toEqual(suplidor);
      expect(mockSuplidorRepository.create).toHaveBeenCalledWith(dto);
      expect(mockSuplidorRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of suplidores', async () => {
      const suplidores = [{ id: 1, nombre: 'Suplidor 1' }];
      mockSuplidorRepository.find.mockResolvedValue(suplidores);
      expect(await service.findAll()).toEqual(suplidores);
      expect(mockSuplidorRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single suplidor by id', async () => {
      const suplidor = { id: 1, nombre: 'Suplidor 1' };
      mockSuplidorRepository.findOne.mockResolvedValue(suplidor);
      expect(await service.findOne(1)).toEqual(suplidor);
      expect(mockSuplidorRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['productos'],
      });
    });

    it('should throw NotFoundException if suplidor is not found', async () => {
      mockSuplidorRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a suplidor and return it', async () => {
      const dto: ActualizarSuplidorDto = { nombre: 'Suplidor Actualizado' };
      const existingSuplidor = { id: 1, nombre: 'Suplidor Original', contacto: 'c', telefono: 't' };
      const updatedSuplidor = { ...existingSuplidor, ...dto };

      mockSuplidorRepository.findOne.mockResolvedValue(existingSuplidor);
      mockSuplidorRepository.save.mockResolvedValue(updatedSuplidor);

      const result = await service.update(1, dto);

      expect(mockSuplidorRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['productos'] });
      expect(mockSuplidorRepository.merge).toHaveBeenCalledWith(existingSuplidor, dto);
      expect(mockSuplidorRepository.save).toHaveBeenCalledWith(existingSuplidor);
      expect(result).toEqual(updatedSuplidor);
    });

    it('should throw NotFoundException when updating a non-existent suplidor', async () => {
      const dto: ActualizarSuplidorDto = { nombre: 'No existe' };
      mockSuplidorRepository.findOne.mockResolvedValue(null);

      await expect(service.update(99, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should find and remove a suplidor', async () => {
      const suplidor = { id: 1, nombre: 'A eliminar' };
      mockSuplidorRepository.findOne.mockResolvedValue(suplidor);
      mockSuplidorRepository.remove.mockResolvedValue(suplidor);

      expect(await service.remove(1)).toEqual(suplidor);
      expect(mockSuplidorRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['productos'] });
      expect(mockSuplidorRepository.remove).toHaveBeenCalledWith(suplidor);
    });

    it('should throw NotFoundException when removing a non-existent suplidor', async () => {
      mockSuplidorRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
