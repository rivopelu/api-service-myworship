import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'file_name' })
  fileName: string;
  @Column({ name: 'mime_type' })
  mimeType: string;
  @Column()
  size: number;
  @Column()
  key: string;
}
