import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'productos' }) // Es una buena práctica nombrar la tabla explícitamente
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  categoria: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number; // Corresponde a 'price'

  @Column()
  cantidad: number; // Corresponde a 'stock'

  @Column()
  cantidadMinima: number; // Corresponde a 'minStock'

  @Column() // Suponiendo que un proveedor es opcional
  proveedorId: number; // Corresponde a 'supplierId'

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fechaCreacion: Date; // Corresponde a 'createdAt'

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  fechaActualizacion: Date; // Corresponde a 'updatedAt'
}
