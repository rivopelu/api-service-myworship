import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from '@entities/User';
import { Artist } from '@entities/Artist';
import { Categories } from '@entities/Categories';
import { StatusEnum } from '@enum/status-enum';

@Entity()
export class Lyrics {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
  @Column()
  status: StatusEnum;
  @Column({ type: 'longtext' })
  description: string;
  @Column({ type: 'longtext' })
  lyric: string;
  @Column({ nullable: true, name: 'notes_request' })
  notesRequest: string;
  @Column({ nullable: true, name: 'notes_revision_reject' })
  notesRevisionReject: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @Column({ type: 'datetime', name: 'published_at' })
  publishAt: Date;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Artist, (Artist) => Artist)
  @JoinColumn({
    name: 'artist',
  })
  artist: Artist;

  @ManyToOne(() => User, (Account) => Account)
  @JoinColumn({
    name: 'created_by',
  })
  created_by: User;
  @ManyToOne(() => User, (Account) => Account)
  @JoinColumn({
    name: 'publish_by',
  })
  approved_by: User;

  @ManyToMany(() => Categories, (cat) => cat.lyrics)
  @JoinTable()
  categories: Categories[];
}
