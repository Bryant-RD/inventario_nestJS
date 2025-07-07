import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles/roles.enum';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; 

  @Column()
  apellido: string; 

  @Column({ unique: true })
  correo: string; 


  @Column({ unique: true ,nullable: true})
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  empresa?: string; 

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fechaCreacion: Date; 

  @UpdateDateColumn({ type: 'timestamp with time zone' , nullable: true})
  fechaActualizacion?: Date; 
}

