import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Producto
 } from 'src/productos/entities/producto.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { HistorialMovimiento } from 'src/historial/entities/historial.entity';
import { Suplidor } from 'src/suplidores/entities/suplidor.entity';

config(); // Carga las variables de entorno desde el archivo .env

/**
 * Esta configuración es utilizada por la CLI de TypeORM para
 * generar y ejecutar las migraciones.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // ¡Importante! No uses synchronize: true en producción con migraciones.
  synchronize: false,
  logging: true,
  entities: [
    Producto,
    Usuario,
    HistorialMovimiento,
    Suplidor,
  ],
  // Apunta a la carpeta donde se guardarán las migraciones
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations', // Nombre de la tabla para registrar las migraciones
});
