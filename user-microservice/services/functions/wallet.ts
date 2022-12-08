import { Wallet } from '@user-microservice/core/wallet';
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
} from 'aws-lambda';
import handler from './util/handler';

export const main: APIGatewayProxyHandlerV2WithJWTAuthorizer = handler(
  async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
    const userID = event.requestContext.authorizer.jwt.claims
      .username as string;

    if (!userID) {
      throw new Error('User not found');
    }

    const result = await Wallet.getByUserID(userID);

    if (!result) {
      throw new Error('Wallet not found');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }
);
