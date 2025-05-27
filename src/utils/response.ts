import { WebResponse } from '@/dtos/response.dto';

export const createResponse = <T>(params: WebResponse<T>) => {
  const { status = 0, message = null, data } = params;
  return { status, message, data };
};
