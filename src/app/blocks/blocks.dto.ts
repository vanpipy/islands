import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BlocksQuery {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  version?: string;
}
