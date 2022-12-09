import { Transaction } from '@wallet-microservice/core/transaction';
import {
  APIGatewayProxyEventV2WithLambdaAuthorizer,
  APIGatewayProxyHandlerV2WithLambdaAuthorizer,
} from 'aws-lambda';
import handler from './util/handler';

export const get: APIGatewayProxyHandlerV2WithLambdaAuthorizer<any> = handler<any>(
  async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<any>) => {
    const userID = event.requestContext.authorizer.lambda.user;

    if (!userID) {
      throw new Error('User not found');
    }

    const result = await Transaction.getBalanceByUserId(userID);

    if (!result) {
      throw new Error('Balance not found');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ balance: result.total_income - result.total_expense }),
    };
  }
);