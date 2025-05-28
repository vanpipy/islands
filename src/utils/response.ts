import { ApiProperty } from '@nestjs/swagger';

export class WebResponse<T> {
  @ApiProperty()
  statusCode?: number;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  data: T;
}

export const createResponse = <T>(params: WebResponse<T>) => {
  const { statusCode = 0, message = null, data } = params;
  return { statusCode, message, data };
};
