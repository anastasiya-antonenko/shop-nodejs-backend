import { middyfy } from '@libs/lambda';
const AWS = require("aws-sdk");
import { v4 } from 'uuid';
import * as yup from 'yup';

const docClient = new AWS.DynamoDB.DocumentClient();

const schema = yup.object().shape({
    description: yup.string().required(),
    price: yup.number().required(),
    title: yup.string().required(),
    count: yup.number()
})

const createProduct = async event => {
    const reqBody = event.body;

    console.log('Event:', event);

    try {
        await schema.validate(reqBody, {abortEarly: false})

        const product = {
            id: v4(),
            description: reqBody.description,
            price: reqBody.price,
            title: reqBody.title,
        }
        const stock = { product_id: product.id, count: reqBody.count };

        await docClient.transactWrite({
            TransactItems: [
                {
                    Put: {
                        Item: product,
                        TableName: "products",
                        ConditionExpression: "attribute_not_exists(#id)",
                        ExpressionAttributeNames: { "#id": "id" }
                    },
                },
                {
                    Put: {
                        Item: stock,
                        TableName: "stocks",
                        ConditionExpression: "attribute_not_exists(#product_id)",
                        ExpressionAttributeNames: { "#product_id": "product_id" }
                    }
                }
            ],
        }).promise()

        console.log('Product: ', product, 'Stock: ', stock);

        return {
            statusCode: 201,
            body: JSON.stringify(product),
        };

    } catch (e) {
        if ( e.name === 'ValidationError') {
            return {
                statusCode: 400,
                body: JSON.stringify({error: e.message}),
            }
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ error: e })
        }
    }
};

export const main = middyfy(createProduct);
