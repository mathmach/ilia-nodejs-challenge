import { Wallet } from '@user-microservice/core/wallet';
import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import handler from './util/handler';

export const main: APIGatewayProxyHandlerV2 = handler(
  async (event: APIGatewayProxyEventV2) => {
    const result = await Wallet.list();

    if (!result) {
      throw new Error('Wallet not found');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }
);
