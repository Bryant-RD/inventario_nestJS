import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity({ name: 'suplidores' })
export class Suplidor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; 

  @Column()
  contacto: string; 

  @Column({ nullable: true })
  telefono?: string;

  @Column({ nullable: true })
  direccion?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fechaCreacion: Date; 

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  fechaActualizacion: Date; 

  @OneToMany(() => Producto, (producto) => producto.proveedor)
  productos: Producto[];
}

