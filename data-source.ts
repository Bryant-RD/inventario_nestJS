import { DataSource } from 'typeorm';
import { Producto } from './src/productos/entities/producto.entity';
import { Usuario } from './src/usuarios/entities/usuario.entity';
import { HistorialMovimiento } from 'src/historial/entities/historial.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'bryant',
  password: '123456',
  database: 'inventario',
  entities: [Producto, Usuario, HistorialMovimiento],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});