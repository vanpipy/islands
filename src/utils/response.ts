export const createResponse = <T>(params: { statusCode?: number; message?: string; data: T }) => {
  const { statusCode = 0, message = null, data } = params;
  return { statusCode, message, data };
};
