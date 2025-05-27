import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class WebResponse<T> {
  @ApiProperty()
  status?: number;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  data: T;
}

export const ApiWebArrayResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(WebResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(WebResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiWebObjectResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(WebResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(WebResponse) },
          {
            properties: {
              data: {
                type: 'object',
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiWebBaseResponse = (type: string) => {
  return applyDecorators(
    ApiExtraModels(WebResponse),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(WebResponse) },
          {
            properties: {
              data: { type },
            },
          },
        ],
      },
    }),
  );
};
