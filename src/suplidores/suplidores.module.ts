import { Module } from '@nestjs/common';
import { SuplidoresService } from './suplidores.service';
import { SuplidoresController } from './suplidores.controller';

@Module({
  providers: [SuplidoresService],
  controllers: [SuplidoresController]
})
export class SuplidoresModule {}
