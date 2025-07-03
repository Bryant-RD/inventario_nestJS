import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../roles/roles.enum';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.EMPLOYEE })
  role: Role;
}
