import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlockEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: number;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column()
  link: string;

  @Column()
  description: string;

  @Column()
  author: string;
}
