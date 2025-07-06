import { Test, TestingModule } from '@nestjs/testing';
import { SuplidorService } from './suplidor.service';

describe('SuplidorService', () => {
  let service: SuplidorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuplidorService],
    }).compile();

    service = module.get<SuplidorService>(SuplidorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
