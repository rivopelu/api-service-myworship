import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lyrics } from './Lyrics';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn('increment')
  id: number;
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
  @ManyToMany(() => Lyrics, (cat) => cat.categories)
  lyrics: Lyrics[];
}
