import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        schemes: ['http', 'https'],
        responses: {
          200: {
            description: 'Successful API response',
            bodyType: 'ProductList'
          }
        }
      },
    },
  ],
};
