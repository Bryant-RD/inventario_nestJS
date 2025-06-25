import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { Producto } from './productos/entities/producto.entity';

@Module({

  imports: [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'bryant',
    password: '123456',
    database: 'inventario',
    entities: [Producto], 
    synchronize: true,
  }),
    ProductosModule,
  ],

})
export class AppModule {}
