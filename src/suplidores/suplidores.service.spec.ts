import { Test, TestingModule } from '@nestjs/testing';
import { SuplidoresService } from './suplidores.service';

describe('SuplidoresService', () => {
  let service: SuplidoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuplidoresService],
    }).compile();

    service = module.get<SuplidoresService>(SuplidoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
