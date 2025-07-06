import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { Role } from '../src/usuarios/roles/roles.enum';

describe('ProductosController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let employeeToken: string;
  let clientToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);

    // Crear usuarios de prueba y obtener tokens
    try {
      await authService.register('e2e_employee', 'password', Role.EMPLOYEE);
    } catch (error) {
      // Ignorar si ya existe
    }
    try {
      await authService.register('e2e_client', 'password', Role.CLIENT);
    } catch (error) {
      // Ignorar si ya existe
    }

    const employeeLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'e2e_employee', password: 'password' });
    employeeToken = employeeLogin.body.access_token;

    const clientLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'e2e_client', password: 'password' });
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
        categoria: 'Test',
        precio: 99.99,
        cantidad: 10
    };

    it('should allow EMPLOYEE to create a product', () => {
      return request(app.getHttpServer())
        .post('/productos/')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(productoDto)
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
          .send(productoDto)
          .expect(403);
      });

    it('should return 401 Unauthorized if no token is provided', () => {
        return request(app.getHttpServer())
          .post('/productos/')
          .send(productoDto)
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
        .send({ nombre: 'Para Actualizar', categoria: 'Test', precio: 10, cantidad: 10, descripcion: '...' });
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
        .send({ nombre: 'Para Eliminar', categoria: 'Test', precio: 10, cantidad: 10, descripcion: '...' });
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