import { APIGatewayProxyEventV2WithLambdaAuthorizer, APIGatewayProxyHandlerV2WithLambdaAuthorizer } from 'aws-lambda';
import handler from './util/handler';
import type { Transactions as TransactionType } from '@wallet-microservice/core/sql.generated';
import axios from 'axios';
import url from 'url';

export const get: APIGatewayProxyHandlerV2WithLambdaAuthorizer<any> = handler<any>(
  async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<any>) => {
    const params = new url.URLSearchParams(event.queryStringParameters);

    const { data } = await axios.get(`${process.env.WALLET_API_URL}/transactions?${params}`, {
      headers: {
        Authorization: event.headers.authorization
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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

    const { data } = await axios.post(`${process.env.WALLET_API_URL}/transactions`, { ...transaction, user_id: event.requestContext.authorizer.lambda.user, amount: Number(transaction.amount) }, {
      headers: {
        Authorization: event.headers.authorization
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  }
);
