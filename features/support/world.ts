import {
  AfterAll,
  BeforeAll,
  Before,
  IWorldOptions,
  setWorldConstructor,
  World,
} from '@cucumber/cucumber';
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
});

AfterAll(async function () {
  if (app) {
    await app.close();
  }
});
