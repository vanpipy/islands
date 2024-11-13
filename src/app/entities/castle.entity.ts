import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CastleEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @Column()
  link?: string;

  @Column()
  dependencies: string;
}
