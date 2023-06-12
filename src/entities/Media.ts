import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ unique: true })
  uuid: string;
  @Column({ name: 'file_name' })
  fileName: string;
  @Column({ name: 'mime_type' })
  mimeType: string;
  @Column()
  size: number;
  @Column()
  key: string;
}
