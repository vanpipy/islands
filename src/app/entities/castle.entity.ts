import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CastleEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: number;

  @Column()
  name: string;

  @Column()
  link: string;
}
