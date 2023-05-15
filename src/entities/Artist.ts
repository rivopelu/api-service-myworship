import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@entities/User';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  slug: string;
  @Column({ nullable: true, type: 'longtext' })
  description: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @ManyToOne(() => User, (Account) => Account)
  @JoinColumn({
    name: 'created_by',
  })
  created_by: User;
}
