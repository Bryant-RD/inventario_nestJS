import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { HistorialMovimiento } from '../historial/entities/historial.entity'; // Importar la entidad
import { CrearProductoDto } from './dtos/crear_productos';
import { ActualizarProductoDto } from './dtos/actualizar_producto';

describe('ProductosService', () => {
  let service: ProductosService;
  let repository: Repository<Producto>;
  let historialRepository: Repository<HistorialMovimiento>; // Variable para el nuevo repo

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Mock para el repositorio de HistorialMovimiento
  const mockHistorialRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockProductRepository,
        },
        { // <-- Añadir el mock del repositorio que faltaba
          provide: getRepositoryToken(HistorialMovimiento),
          useValue: mockHistorialRepository,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repository = module.get<Repository<Producto>>(getRepositoryToken(Producto));
    historialRepository = module.get<Repository<HistorialMovimiento>>(getRepositoryToken(HistorialMovimiento));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new product', async () => {
      const dto: CrearProductoDto = { nombre: 'Nuevo Producto', categoria: 'A', cantidad: 10, descripcion: 'Desc', precio: 100, cantidadMinima: 5, proveedorId: 1 };
      const producto = { id: 1, ...dto };

      mockProductRepository.create.mockReturnValue(dto);
      mockProductRepository.save.mockResolvedValue(producto);

      expect(await service.create(dto)).toEqual(producto);
      expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
      expect(mockProductRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const productos = [{ id: 1, nombre: 'Producto 1' }];
      mockProductRepository.find.mockResolvedValue(productos);
      expect(await service.findAll()).toEqual(productos);
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const producto = { id: 1, nombre: 'Producto 1' };
      mockProductRepository.findOneBy.mockResolvedValue(producto);
      expect(await service.findOne(1)).toEqual(producto);
      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if product is not found', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product and return it', async () => {
const dto: ActualizarProductoDto = { nombre: 'Producto Actualizado', descripcion: 'Desc', categoria: 'A', cantidad: 10, precio: 100 };
      const existingProduct = { id: 1, nombre: 'Producto Original' };
      const updatedProduct = { ...existingProduct, ...dto };

      mockProductRepository.findOneBy.mockResolvedValueOnce(existingProduct); // Para la validación inicial
      mockProductRepository.update.mockResolvedValue({ affected: 1 });
      mockProductRepository.findOneBy.mockResolvedValueOnce(updatedProduct); // Para el retorno final

      expect(await service.update(1, dto)).toEqual(updatedProduct);
      expect(mockProductRepository.update).toHaveBeenCalledWith(1, dto);
      expect(mockProductRepository.findOneBy).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when updating a non-existent product', async () => {
      const dto: ActualizarProductoDto = { nombre: 'Producto Actualizado', descripcion: 'Desc', categoria: 'A', cantidad: 10, precio: 100 };
      mockProductRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, dto)).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should find and remove a product', async () => {
      const producto = { id: 1, nombre: 'A eliminar' };
      mockProductRepository.findOneBy.mockResolvedValueOnce(producto);
      mockProductRepository.remove.mockResolvedValue(producto);

      expect(await service.remove(1)).toEqual(producto);
      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockProductRepository.remove).toHaveBeenCalledWith(producto);
    });

    it('should throw NotFoundException when removing a non-existent product', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.remove).not.toHaveBeenCalled();
    });
  });
});
