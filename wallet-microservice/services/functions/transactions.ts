import { Transaction } from '@wallet-microservice/core/transaction';
import { APIGatewayProxyEventV2WithLambdaAuthorizer, APIGatewayProxyHandlerV2WithLambdaAuthorizer } from 'aws-lambda';
import handler from './util/handler';
import type { Transactions as TransactionType } from '@wallet-microservice/core/sql.generated';

export const get: APIGatewayProxyHandlerV2WithLambdaAuthorizer<any> = handler<any>(
  async () => {
    const result = await Transaction.list();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  }
);

export const post: APIGatewayProxyHandlerV2WithLambdaAuthorizer<any> = handler<any>(
  async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<any>) => {
    const transaction: TransactionType = JSON.parse(event.body || '{}');

    //TODO Validation
    if (!transaction) {
      throw new Error('Transaction cannot be empty');
    }

    const result = await Transaction.create({ ...transaction, user_id: event.requestContext.authorizer.lambda.user, amount: Number(transaction.amount) });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  }
);
