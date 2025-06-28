import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Roles } from '../roles/roles.enum';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.EMPLOYEE })
  role: Roles;
}
