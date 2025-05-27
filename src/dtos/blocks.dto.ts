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

export class BlockData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  org: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  spec: string;

  @ApiProperty()
  requireRef: string;

  @ApiProperty()
  dependencies: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
