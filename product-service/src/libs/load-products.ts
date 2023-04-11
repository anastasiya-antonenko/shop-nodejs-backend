import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
const ddb = new DynamoDBClient({ apiVersion: "2012-08-10" });

const convertObject = (products, stocks)  => {
    const newProductList = products.map(item => {
        return {
            id: item.id?.S,
            title: item.title?.S,
            description: item.description?.S || '',
            price: item.price?.N || ''
        }
    });
    const newStocksList = stocks.map(item => {
        return {
            product_id: item.product_id?.S,
            count: item.count?.N
        }
    });

    console.log(newProductList)
    console.log(newStocksList)

    const result = newProductList.map(item1 => {
        const item2 = newStocksList.find(item2 => item2.product_id === item1.id);
        return { ...item1, count: item2.count };
    });

    return result;
}

export const loadProducts = async () => {
    const productParams = {
        TableName: process.env.TABLE_NAME_PRODUCTS,
    };

    const stockParams = {
        TableName: process.env.TABLE_NAME_STOCKS,
    };

    const products = await ddb.send(new ScanCommand(productParams));
    const stocks = await ddb.send(new ScanCommand(stockParams));

    return convertObject(products.Items, stocks.Items);
};
