import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suplidor } from './entities/suplidor.entity';
import { SuplidoresController } from './suplidores.controller';
import { SuplidoresService } from './suplidores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Suplidor])],
  controllers: [SuplidoresController],
  providers: [SuplidoresService],
})
export class SuplidoresModule {}