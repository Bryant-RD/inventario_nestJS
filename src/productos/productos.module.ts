import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { HistorialMovimiento } from 'src/historial/entities/historial.entity';


@Module({
   imports: [TypeOrmModule.forFeature([Producto, HistorialMovimiento])],
  controllers: [ProductosController],
  providers: [ProductosService]

})
export class ProductosModule {}
