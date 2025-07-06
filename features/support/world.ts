import {
  setWorldConstructor,
  World,
  BeforeAll,
  AfterAll,
} from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import request, { Response } from 'supertest';

export class CustomWorld extends World {
  app: INestApplication;
  request: ReturnType<typeof request>;
  response: Response;
  token: string;
}

setWorldConstructor(CustomWorld);

let app: INestApplication;

BeforeAll(async function (this: CustomWorld) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  this.request = request(app.getHttpServer());
});

AfterAll(async () => {
  await app.close();
});