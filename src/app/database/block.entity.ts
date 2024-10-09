import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlockEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  version: string

  @Column()
  type: string

  @Column()
  requireRef: string;

  @Column()
  description: string;

  @Column()
  author: string;

  @Column()
  link: string;
}
