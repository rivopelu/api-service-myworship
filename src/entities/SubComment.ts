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
import { Comment } from './Comment';

@Entity({ name: 'sub_comment' })
export class SubComment {
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

  @ManyToOne(() => Comment, (lyrics) => lyrics.subComment)
  @JoinColumn({
    name: 'parent_comment',
  })
  parentComment: Comment;
}
