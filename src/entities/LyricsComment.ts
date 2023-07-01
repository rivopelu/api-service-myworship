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
import { SubLyricsComment } from './SubLyricsComment';

@Entity({ name: 'lyrics_comment' })
export class LyricsComment {
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

  @OneToMany(() => SubLyricsComment, (sub) => sub.parentComment)
  subComment: SubLyricsComment[];
}
