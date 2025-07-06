import { Module } from '@nestjs/common';
import { SuplidorService } from './suplidor.service';
import { SuplidorController } from './suplidor.controller';

@Module({
  providers: [SuplidorService],
  controllers: [SuplidorController]
})
export class SuplidorModule {}
