import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlockEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  org: string;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column()
  link: string;

  @Column()
  spec: string;

  @Column()
  requireRef: string;

  @Column()
  dependencies: string;
}
