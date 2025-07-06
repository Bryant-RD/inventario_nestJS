import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { Producto } from './productos/entities/producto.entity';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './usuarios/entities/usuario.entity';
import { SuplidorModule } from './suplidor/suplidor.module';

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
    SuplidorModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],

})
export class AppModule {}
