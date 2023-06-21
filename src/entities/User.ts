import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '../enum/user-role-enum';
import { Artist } from './Artist';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: false, default: UserRoleEnum.USER })
  role: UserRoleEnum;
  @Column({ nullable: true })
  image: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @OneToMany(() => Artist, (artist) => artist.created_by)
  artist_created: Artist[];
}
