import {formatJSONErrorResponse, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from "aws-lambda";
import { loadProducts } from "@libs/product";
import { getProductsById as getProductsByIdHandler } from "./../../utils/get-products";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;
  const products = await loadProducts();
  const product = getProductsByIdHandler(products, id);
    if (product) {
        return formatJSONResponse({ product });
    }
    return formatJSONErrorResponse();
}

export const main = middyfy(getProductById);
