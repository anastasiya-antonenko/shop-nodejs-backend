import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        cors: true,
        authorizer: 'arn:aws:lambda:us-east-1:274922047683:function:authorization-service-dev-basicAuthorizer',
        schemes: ['http', 'https'],
        response: {
          headers: {
              'Access-Control-Allow-Origin':  '*'
          }
        }
      },
    },
  ],
};
