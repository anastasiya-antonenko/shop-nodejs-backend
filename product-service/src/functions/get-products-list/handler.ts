import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from "aws-lambda";
import { loadProducts } from "@libs/product";

const getProductsList : APIGatewayProxyHandler = async () => {
  const products = await loadProducts();
  return formatJSONResponse(products);
}

export const main = middyfy(getProductsList);
