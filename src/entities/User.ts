import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '@enum/user-role-enum';
import { Artist } from '@entities/Artist';

@Entity()
export class User {
  @Column({ primary: true })
  @Generated('uuid')
  id: string;
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
