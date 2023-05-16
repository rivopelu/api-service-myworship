import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@entities/User';
import { StatusEnum } from '@enum/status-enum';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  slug: string;
  @Column()
  status: StatusEnum;
  @Column({ nullable: true, type: 'longtext' })
  description: string;
  @Column({ nullable: true, name: 'notes_request' })
  notesRequest: string;
  @Column({ nullable: true, name: 'notes_revision' })
  notesRevision: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @Column({ type: 'datetime', name: 'published_at' })
  publishAt: Date;
  @ManyToOne(() => User, (Account) => Account)
  @JoinColumn({
    name: 'created_by',
  })
  created_by: User;
  @ManyToOne(() => User, (Account) => Account)
  @JoinColumn({
    name: 'approved_by',
  })
  approved_by: User;
}
