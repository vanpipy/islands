import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BlockData } from './blocks.dto';

export class CastleQuery {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CastleData {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  link?: string;

  @ApiProperty({ type: [BlockData] })
  dependencies?: BlockData[];
}
