import { SQSEvent } from 'aws-lambda';
import { v4 } from 'uuid';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const snsClient = new SNSClient({ region: 'us-east-1' });

export const catalogBatchProcess = async (event: SQSEvent) => {
    try {
        for (const row of event.Records) {
            const reqBody = JSON.parse(row.body);
            const product = {
                id: v4(),
                description: reqBody.description,
                price: reqBody.price,
                title: reqBody.title,
            }

            const stock = {
                product_id: product.id,
                count: Number(reqBody.count)
            };

            const params = {
                TopicArn: "arn:aws:sns:us-east-1:274922047683:createProductTopic",
                Message: `Product ${reqBody.title} was created!`,
                MessageAttributes: {
                    messagePrice: {
                        DataType: 'String',
                        StringValue: reqBody.price < 3 ? 'Sale' : 'Default'
                    }
                }
            };

            await docClient.put({
                TableName: 'products',
                Item: product
            }).promise()

            await docClient.put({
                TableName: 'stocks',
                Item: stock
            }).promise()

            await snsClient.send(new PublishCommand(params));
        }
    } catch (e) {
        console.log(e)
    }
};

export const main = catalogBatchProcess;
