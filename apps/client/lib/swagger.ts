import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'krush kourse api',
        version: '1.0',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          DataResponse: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
              },
            },
          },
          MessageResponse: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
            },
          },
          Error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
              details: {
                type: 'object',
              },
            },
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
