import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from "aws-lambda";
import { loadProducts } from "@libs/load-products";

const getProductsList : APIGatewayProxyHandler = async (event) => {
  const products = await loadProducts();

  console.log('Event:', event);

  return formatJSONResponse(products);
}

export const main = middyfy(getProductsList);
