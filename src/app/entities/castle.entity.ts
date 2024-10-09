import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CastleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column()
  link: string;
}
