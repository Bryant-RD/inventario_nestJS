import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { Role } from '../src/usuarios/roles/roles.enum';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Suplidor } from 'src/suplidores/entities/suplidor.entity';

describe('ProductosController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let employeeToken: string;
  let clientToken: string;
  let testProveedorId: number;

  // Generamos un sufijo aleatorio para asegurar que los usuarios sean únicos en cada ejecución
  const testSuffix = Math.random().toString(36).substring(7);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);

    // --- INICIO: Sembrar la base de datos ---
    // Obtenemos el repositorio de Proveedor
    const proveedorRepository = moduleFixture.get<Repository<Suplidor>>(
      getRepositoryToken(Suplidor),
    );
    // Creamos un proveedor para asegurar que la clave foránea (FK) exista
    const proveedor = await proveedorRepository.save({
      nombre: 'Proveedor de Prueba E2E',
      contacto: 'Contacto de Prueba', // Añadido para cumplir con la restricción NOT NULL
    });
    testProveedorId = proveedor.id;
    // --- FIN: Sembrar la base de datos ---

    // Crear usuarios de prueba únicos para evitar conflictos con datos de ejecuciones anteriores
    const employeeEmail = `e2e_employee_${testSuffix}@example.com`;
    await authService.register({
      username: `e2e_employee_${testSuffix}`, password: 'password',
      firstName: 'e2e_employee',
      lastName: 'e2e_employee',
      email: employeeEmail,
      role: Role.EMPLOYEE,
    });

    const clientEmail = `e2e_client_${testSuffix}@example.com`;
    await authService.register({
      username: `e2e_client_${testSuffix}`, password: 'password',
      firstName: 'e2e_client',
      lastName: 'e2e_client',
      email: clientEmail,
      role: Role.CLIENT,
    });

    const employeeLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: employeeEmail, password: 'password' });
    
    // Verificamos que el login fue exitoso y obtuvimos un token
    expect(employeeLogin.status).toBe(201);
    expect(employeeLogin.body.access_token).toBeDefined();
    employeeToken = employeeLogin.body.access_token;

    const clientLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: clientEmail, password: 'password' });

    // Verificamos que el login fue exitoso y obtuvimos un token
    expect(clientLogin.status).toBe(201);
    expect(clientLogin.body.access_token).toBeDefined();
    clientToken = clientLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/productos (GET)', () => {
    it('should allow access to CLIENT role', () => {
      return request(app.getHttpServer())
        .get('/productos/')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);
    });

    it('should deny access without a token', () => {
      return request(app.getHttpServer())
        .get('/productos/')
        .expect(401);
    });
  });

  describe('/productos (POST)', () => {
    const productoDto = {
        nombre: 'Producto E2E',
        descripcion: 'Desde test E2E',
        categoria: 'A', // Corregido: Usar un valor de categoría válido como en el test unitario.
        precio: 99.99,
        cantidad: 10,
        // Añadimos los campos que faltaban para pasar la validación del DTO
        cantidadMinima: 5,
        proveedorId: 1, // Este valor se sobreescribirá con el ID real
    };

    it('should allow EMPLOYEE to create a product', () => {
      return request(app.getHttpServer())
        .post('/productos/')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ ...productoDto, proveedorId: testProveedorId })
        .expect(201)
        .then(response => {
            expect(response.body).toHaveProperty('id');
            expect(response.body.nombre).toEqual(productoDto.nombre);
        });
    });

    it('should FORBID CLIENT from creating a product', () => {
        return request(app.getHttpServer())
          .post('/productos/')
          .set('Authorization', `Bearer ${clientToken}`)
          .send({ ...productoDto, proveedorId: testProveedorId })
          .expect(403);
      });

    it('should return 401 Unauthorized if no token is provided', () => {
        return request(app.getHttpServer())
          .post('/productos/')
          .send({ ...productoDto, proveedorId: testProveedorId })
          .expect(401);
    });
  });

  describe('/productos/:id (PATCH)', () => {
    let productoId: number;

    // Creamos un producto antes de las pruebas de PATCH para tener un ID con el que trabajar
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/productos/')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          nombre: 'Para Actualizar',
          categoria: 'A', // Corregido: Usar un valor de categoría válido.
          precio: 10,
          cantidad: 10,
          descripcion: '...',
          cantidadMinima: 5,
          proveedorId: testProveedorId,
        });
      productoId = response.body.id;
    });

    it('should allow EMPLOYEE to update a product', () => {
      return request(app.getHttpServer())
        .patch(`/productos/${productoId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ nombre: 'Producto Actualizado E2E' })
        .expect(200)
        .then(response => {
          expect(response.body.nombre).toEqual('Producto Actualizado E2E');
        });
    });

    it('should FORBID CLIENT from updating a product', () => {
      return request(app.getHttpServer())
        .patch(`/productos/${productoId}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ nombre: 'Intento de Cliente' })
        .expect(403);
    });
  });

  describe('/productos/:id (DELETE)', () => {
    let productoId: number;

    // Creamos un producto antes de las pruebas de DELETE
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/productos/')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          nombre: 'Para Eliminar',
          categoria: 'A', // Corregido: Usar un valor de categoría válido.
          precio: 10,
          cantidad: 10,
          descripcion: '...',
          cantidadMinima: 5,
          proveedorId: testProveedorId,
        });
      productoId = response.body.id;
    });

    it('should FORBID CLIENT from deleting a product', () => {
      return request(app.getHttpServer())
        .delete(`/productos/${productoId}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(403);
    });

    it('should allow EMPLOYEE to delete a product', () => {
      return request(app.getHttpServer())
        .delete(`/productos/${productoId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .expect(200);
    });
  });

});