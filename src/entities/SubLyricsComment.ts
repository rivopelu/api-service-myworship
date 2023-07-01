import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Lyrics } from './Lyrics';
import { LyricsComment } from './LyricsComment';

@Entity({ name: 'sub_lyrics_comment' })
export class SubLyricsComment {
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

  @ManyToOne(() => LyricsComment, (lyrics) => lyrics.subComment)
  @JoinColumn({
    name: 'parent_comment',
  })
  parentComment: LyricsComment;
}
