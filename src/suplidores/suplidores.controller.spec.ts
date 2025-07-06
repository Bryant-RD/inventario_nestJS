import { Test, TestingModule } from '@nestjs/testing';
import { SuplidoresController as SuplidoresController } from './suplidores.controller';

describe('SuplidoresController', () => {
  let controller: SuplidoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuplidoresController],
    }).compile();

    controller = module.get<SuplidoresController>(SuplidoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
