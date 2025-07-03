import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear_productos';
// import { ActualizarProductoDto } from './dto/actualizar_producto';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockProductosService = {
    findAll: jest.fn(() => [
      { id: 1, nombre: 'Producto 1', descripcion: 'desc', categoria: 'cat', precio: 10, cantidad: 5 },
    ]),
    findOne: jest.fn((id) => ({ id, nombre: 'Producto 1', descripcion: 'desc', categoria: 'cat', precio: 10, cantidad: 5 })),
    create: jest.fn((dto) => ({ id: 2, ...dto })),
    remove: jest.fn((id) => ({ deleted: true })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        { provide: ProductosService, useValue: mockProductosService },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debe retornar todos los productos', async () => {
    const result = await controller.getAllProducts();
    expect(result).toEqual([
      { id: 1, nombre: 'Producto 1', descripcion: 'desc', categoria: 'cat', precio: 10, cantidad: 5 },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('debe retornar un producto por id', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({ id: 1, nombre: 'Producto 1', descripcion: 'desc', categoria: 'cat', precio: 10, cantidad: 5 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('debe crear un producto', async () => {
    const dto: CrearProductoDto = {
      nombre: 'Nuevo',
      descripcion: 'desc',
      categoria: 'cat',
      precio: 20,
      cantidad: 2,
    };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 2, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('debe eliminar un producto', async () => {
    const result = await controller.delete(1);
    expect(result).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  // it('debe actualizar un producto', async () => {
  //   const dto = { nombre: 'Actualizado' };
  //   const result = await controller.update(1, dto);
  //   expect(result).toEqual({ id: 1, ...dto });
  //   expect(service.update).toHaveBeenCalledWith(1, dto);
  // });
});