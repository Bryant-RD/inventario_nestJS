import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialMovimiento } from './historial/entities/historial.entity';
import { ProductosModule } from './productos/productos.module';
import { Producto } from './productos/entities/producto.entity';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './usuarios/entities/usuario.entity';
import { SuplidoresModule } from './suplidores/suplidores.module';
import { Suplidor } from './suplidores/entities/suplidor.entity';

@Module({

  imports: [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'bryant',
    password: '123456',
    database: 'inventario',
    entities: [Producto, Usuario, Suplidor, HistorialMovimiento], 
    synchronize: true,
  }),
    ProductosModule,
    AuthModule,
    SuplidoresModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],

})
export class AppModule {}
