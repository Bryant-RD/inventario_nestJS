import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { MetricsMiddleware } from './metrics/metrics.middleware';

import { HistorialMovimiento } from './historial/entities/historial.entity';
import { ProductosModule } from './productos/productos.module';
import { Producto } from './productos/entities/producto.entity';
import { AuthModule } from './auth/auth.module';
import { Usuario } from './usuarios/entities/usuario.entity';
import { SuplidoresModule } from './suplidores/suplidores.module';
import { Suplidor } from './suplidores/entities/suplidor.entity';
import { MetricsModule } from './metrics/metrics.module';



@Module({

  imports: [
  ConfigModule.forRoot({
      isGlobal: true, // para que todas las partes de la app puedan acceder a las variables de entorno
    }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>('PGHOST', 'localhost'),
      port: configService.get<number>('PGPORT', 5432),
      username: configService.get<string>('PGUSER'),
      password: configService.get<string>('PGPASSWORD'),
      database: configService.get<string>('PGDATABASE'),
      entities: [Producto, Usuario, Suplidor, HistorialMovimiento],
      synchronize: configService.get<string>('NODE_ENV') !== 'production',
    }),
  }),
    ProductosModule,
    AuthModule,
    SuplidoresModule,
    MetricsModule
  ],
  // providers: [AppService],

})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
