import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import-products-file';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: '${self:custom.bucketName}',
      FILE_NAME: '${self:custom.fileName}',
      UPLOADED_FOLDER: '${self:custom.uploadedFolder}',
      PARSED_FOLDER: '${self:custom.parsedFolder}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          's3:ListBucket',
        ],
        Resource: '*'
      },
      {
        Effect: 'Allow',
        Action: [
          's3:*',
        ],
        Resource: 'arn:aws:s3:::${self:custom.bucketName}/*',
      },
      {
        Effect: 'Allow',
        Action: [
            'sqs:*'
        ],
        Resource: 'arn:aws:sqs:us-east-1:274922047683:catalogItemsQueue'
      },
    ]
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    bucketName: 'cat-shop-uploaded',
    fileName: 'products.csv',
    uploadedFolder: 'uploaded',
    parsedFolder: 'parsed',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
      Resources: {
        ImportFileBucket: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: '${self:custom.bucketName}'
            }
        }
      }
  }
};

module.exports = serverlessConfiguration;
