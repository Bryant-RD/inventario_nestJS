import { Suplidor } from 'src/suplidores/entities/suplidor.entity';
import { HistorialMovimiento } from 'src/historial/entities/historial.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @Column({ nullable: true }) // Suponiendo que un proveedor es opcional
  proveedorId: number; // Corresponde a 'supplierId'

  @ManyToOne(() => Suplidor, (suplidor) => suplidor.productos)
  @JoinColumn({ name: 'proveedorId' })
  proveedor: Suplidor;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fechaCreacion: Date; // Corresponde a 'createdAt'

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  fechaActualizacion: Date; // Corresponde a 'updatedAt'
  
   @OneToMany(() => HistorialMovimiento, (historial) => historial.producto)
  historial: HistorialMovimiento[];
}
