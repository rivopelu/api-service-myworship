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
import { User } from './User';
import { Lyrics } from './Lyrics';
import { SubComment } from './SubLyricsComment';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @Column({ type: 'longtext' })
  comment: string;
  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'comment_by' })
  comment_by: User;
  @ManyToOne(() => Lyrics, (lyrics) => lyrics.comments)
  @JoinColumn({
    name: 'lyric',
  })
  lyrics: Lyrics;

  @OneToMany(() => SubComment, (sub) => sub.parentComment)
  subComment: SubComment[];
}
