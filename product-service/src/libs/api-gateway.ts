import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: unknown[] | unknown) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const formatJSONErrorResponse = () => {
    return {
        statusCode: 404,
        body: 'Product not found'
    }
}
