import { User } from '@user-microservice/core/user';
import { APIGatewayProxyEventV2WithLambdaAuthorizer, APIGatewayProxyHandlerV2WithLambdaAuthorizer } from 'aws-lambda';
import { Encrypt } from '../util/encrypt';
import handler from '../util/handler';
import type { Users as UserType } from '@user-microservice/core/sql.generated';

export const get: APIGatewayProxyHandlerV2WithLambdaAuthorizer<any> = handler<any>(
  async () => {
    const result = await User.list();

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
    const user: UserType = JSON.parse(event.body || '{}');

    //TODO Validation
    if (!user) {
      throw new Error('User cannot be empty');
    }

    const result = await User.create({ ...user, password: await Encrypt.cryptPassword(user.password) });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  }
);
