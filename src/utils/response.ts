export interface WebResponse<T> {
  statusCode?: number;
  message?: string;
  data: T;
}

export const createResponse = <T>(params: WebResponse<T>) => {
  const { statusCode = 0, message = null, data } = params;
  return { statusCode, message, data };
};
