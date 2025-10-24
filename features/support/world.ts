import {
  AfterAll,
  BeforeAll,
  Before,
  IWorldOptions,
  setWorldConstructor,
  World,
} from '@cucumber/cucumber';
import { Usuario } from '../../src/usuarios/entities/usuario.entity';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../../src/app.module';

export class CustomWorld extends World {
  public app!: INestApplication;
  public request!: supertest.SuperTest<supertest.Test>;
  public response!: supertest.Response;
  public token!: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

let app: INestApplication;
let request: supertest.SuperTest<supertest.Test>;

BeforeAll({ timeout: 30 * 1000 }, async function () {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  request = (supertest as any)(app.getHttpServer()) as supertest.SuperTest<supertest.Test>;
});

Before(async function (this: CustomWorld) {
  // Asigna la aplicación y el agente de request a la instancia del mundo de este escenario
  this.app = app;
  this.request = request;

  // Limpia la base de datos antes de cada escenario
  const dataSource = app.get(DataSource);
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    // Usamos TRUNCATE para un borrado rápido y para reiniciar las secuencias de IDs.
    // CASCADE asegura que se borren las filas en tablas relacionadas.
    await repository.query(
      `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`,
    );
  }

  // Después de limpiar, crea los datos base necesarios para las pruebas.
  // Por ejemplo, un proveedor por defecto para que las pruebas de productos no fallen.
  const suplidorRepository = dataSource.getRepository('Suplidor');
  await suplidorRepository.query(
    `INSERT INTO "suplidores" (id, nombre, contacto, direccion) VALUES (1, 'Proveedor por Defecto', 'contacto@proveedor.com', 'Calle Falsa 123');`,
  );
});

AfterAll(async function () {
  if (app) {
    await app.close();
  }
});
