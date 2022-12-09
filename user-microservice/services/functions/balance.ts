import {
  APIGatewayProxyEventV2WithLambdaAuthorizer,
  APIGatewayProxyHandlerV2WithLambdaAuthorizer,
} from 'aws-lambda';
import axios from 'axios';
import handler from './util/handler';

export const get: APIGatewayProxyHandlerV2WithLambdaAuthorizer<any> = handler<any>(
  async (event: APIGatewayProxyEventV2WithLambdaAuthorizer<any>) => {
    const userID = event.requestContext.authorizer.lambda.user;

    if (!userID) {
      throw new Error('User not found');
    }

    const { data } = await axios.get(`${process.env.WALLET_API_URL}/balance`, {
      headers: {
        Authorization: event.headers.authorization
      }
    });

    if (!data) {
      throw new Error('Balance not found');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ balance: data.total_income - data.total_expense }),
    };
  }
);