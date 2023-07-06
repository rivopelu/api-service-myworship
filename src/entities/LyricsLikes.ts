import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Lyrics } from './Lyrics';

@Entity('lyrics_like')
export class LyricsLikes {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @ManyToOne(() => User, (us) => us.lyrics_like)
  @JoinColumn({
    name: 'user',
  })
  user: User;
  @ManyToOne(() => Lyrics, (lyrics) => lyrics.comments)
  @JoinColumn({
    name: 'lyric',
  })
  lyrics: Lyrics;
}
