import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import handler from './util/handler';

export const main: APIGatewayProxyHandlerV2 = handler(
  async (event: APIGatewayProxyEventV2) => {
    return {
      statusCode: 200,
      body: 'Hello stranger!',
    };
  }
);
