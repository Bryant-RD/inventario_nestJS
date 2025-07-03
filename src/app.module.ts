import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { Producto } from './productos/entities/producto.entity';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './usuarios/entities/usuario.entity';

@Module({

  imports: [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'bryant',
    password: '123456',
    database: 'inventario',
    entities: [Producto, Usuario], 
    synchronize: true,
  }),
    ProductosModule,
    AuthModule,
  ],

})
export class AppModule {}
