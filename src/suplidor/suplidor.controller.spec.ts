import { Test, TestingModule } from '@nestjs/testing';
import { SuplidorController } from './suplidor.controller';

describe('SuplidorController', () => {
  let controller: SuplidorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuplidorController],
    }).compile();

    controller = module.get<SuplidorController>(SuplidorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
