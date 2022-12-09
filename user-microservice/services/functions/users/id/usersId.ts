import { User } from '@user-microservice/core/user';
import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda';
import handler from '../../util/handler';
import type { Users as UserType } from '@user-microservice/core/sql.generated';

export const get: APIGatewayProxyHandlerV2WithJWTAuthorizer = handler<any>(
  async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
    const id = event.pathParameters?.id;

    //TODO Validation
    if (!id) {
      throw new Error('Id not provided');
    }

    const result = await User.getById(id);

    if (!result) {
      throw new Error('User not found');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  }
);

export const put: APIGatewayProxyHandlerV2WithJWTAuthorizer = handler<any>(
  async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
    const id = event.pathParameters?.id;

    //TODO Validation
    if (!id) {
      throw new Error('Id not provided');
    }

    const user: UserType = JSON.parse(event.body || '{}');

    //TODO Validation
    if (!user) {
      throw new Error('User cannot be empty');
    }

    const current = await User.getById(id);

    if (!current) {
      throw new Error('User not found');
    }

    const result = await User.update(id, user);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  }
);

export const del: APIGatewayProxyHandlerV2WithJWTAuthorizer = handler<any>(
  async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
    const id = event.pathParameters?.id;

    //TODO Validation
    if (!id) {
      throw new Error('Id not provided');
    }

    const result = await User.deleteById(id);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  }
);
