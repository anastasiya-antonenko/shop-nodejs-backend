import type { AWS } from '@serverless/typescript';
import getProductsList from '@functions/get-products-list';
import getProductById from '@functions/get-product-by-id';
import createProduct from '@functions/create-product';
import catalogBatchProcess from '@functions/catalog-batch-process';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '3',
    plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'us-east-1',
        stage: "dev",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            TABLE_NAME_PRODUCTS: 'products',
            TABLE_NAME_STOCKS: 'stocks',

        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    'dynamodb:DescribeTable',
                    'dynamodb:Query',
                    'dynamodb:Scan',
                    'dynamodb:GetItem',
                    'dynamodb:PutItem',
                    'dynamodb:UpdateItem',
                    'dynamodb:DeleteItem',
                ],
                Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/*'
            },
            {
                Effect: 'Allow',
                Action: [
                    'sqs:*'
                ],
                Resource: 'arn:aws:sqs:us-east-1:274922047683:catalogItemsQueue'
            },
            {
                Effect: 'Allow',
                Action: ['sns:*'],
                Resource: 'arn:aws:sns:us-east-1:274922047683:createProductTopic',
            },
        ]
    },
    // import the function via paths
    functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: true,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
            watch: {
                pattern: ['src/**/*.ts'],
                ignore: ['temp/**/*']
            }
        },
        autoswagger: {
          generateSwaggerOnDeploy: true,
          host: '6h7c8p3orb.execute-api.us-east-1.amazonaws.com/dev',
        }
    },
    resources: {
        Resources: {
            catalogItemsQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'catalogItemsQueue'
                }
            },
            // createProductTopic: {
            //     Type: 'AWS::SNS::Topic',
            //     Properties: {
            //         TopicName: 'createProductTopic',
            //         Subscription: [
            //             {
            //                 Protocol: 'email',
            //                 Endpoint: 'nastyaantonenko99@mail.ru'
            //             }
            //         ],
            //         filterPolicyScope: 'Message',
            //         filterPolicy: {
            //             count: [1]
            //         }
            //     }
            // },
            createProductTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'createProductTopic'
                }
            },
            SNSSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    Endpoint: 'nastyaantonenko99@mail.ru',
                    TopicArn: {
                        Ref: 'createProductTopic'
                    },
                    FilterPolicy: {
                        messagePrice: ['Default']
                    }
                }
            },
            SNSMultSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    Endpoint: 'nastyaantonenko99999@gmail.com',
                    TopicArn: {
                        Ref: 'createProductTopic'
                    },
                    FilterPolicy: {
                        messagePrice: ['Default', 'Sale']
                    }
                }
            },
            products: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: 'products',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'id',
                            AttributeType: 'S'
                        },
                        {
                            AttributeName: 'title',
                            AttributeType: 'S'
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'id',
                            KeyType: 'HASH'
                        },
                        {
                            AttributeName: 'title',
                            KeyType: 'RANGE'
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            },
            stocks: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: 'stocks',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'product_id',
                            AttributeType: 'S'
                        },
                        {
                            AttributeName: 'count',
                            AttributeType: 'N'
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'product_id',
                            KeyType: 'HASH'
                        },
                        {
                            AttributeName: 'count',
                            KeyType: 'RANGE'
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            }
        }
    }
};

module.exports = serverlessConfiguration;
