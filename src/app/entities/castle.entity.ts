import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CastleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  link: string;
}
