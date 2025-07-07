import { Test, TestingModule } from '@nestjs/testing';
import { SuplidoresController } from './suplidores.controller';
import { SuplidoresService } from './suplidores.service';
import { CrearSuplidorDto } from './dtos/crear-suplidor.dto';
import { ActualizarSuplidorDto } from './dtos/actualizar-suplidor.dto';

describe('SuplidoresController', () => {
  let controller: SuplidoresController;
  let service: SuplidoresService;

  const mockSuplidor = {
    id: 1,
    nombre: 'Suplidor 1',
    contacto: 'Contacto 1',
    telefono: '123-456-7890',
  };

  const mockSuplidoresService = {
    create: jest.fn((dto: CrearSuplidorDto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([mockSuplidor]),
    findOne: jest.fn((id: number) =>
      Promise.resolve({
        ...mockSuplidor,
        id,
      }),
    ),
    update: jest.fn((id: number, dto: ActualizarSuplidorDto) =>
      Promise.resolve({ id, ...dto }),
    ),
    remove: jest.fn((id: number) => Promise.resolve({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuplidoresController],
      providers: [
        { provide: SuplidoresService, useValue: mockSuplidoresService },
      ],
    }).compile();

    controller = module.get<SuplidoresController>(SuplidoresController);
    service = module.get<SuplidoresService>(SuplidoresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a suplidor', async () => {
    const dto: CrearSuplidorDto = {
      nombre: 'Nuevo Suplidor',
      contacto: 'Nuevo Contacto',
      telefono: '987-654-3210',
    };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all suplidores', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockSuplidor]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a suplidor by id', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockSuplidor);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a suplidor', async () => {
    const dto: ActualizarSuplidorDto = {
      nombre: 'Suplidor Actualizado',
      contacto: 'Contacto Actualizado',
      telefono: '555-123-4567',
    };
    const result = await controller.update(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a suplidor', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
