import type { AWS } from '@serverless/typescript';
import getProductsList from '@functions/get-products-list';
import getProductById from '@functions/get-product-by-id';
import { default as esbuild } from 'esBuild.config';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
      'serverless-auto-swagger',
      'serverless-offline',
      'serverless-esbuild',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    stage: 'dev',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductById },
  package: { individually: true },
  custom: {
    esbuild,
    autoswagger: {
      generateSwaggerOnDeploy: true,
      host: 'afgfgse3n7.execute-api.us-east-1.amazonaws.com/dev',
    }
  }
};

module.exports = serverlessConfiguration;
