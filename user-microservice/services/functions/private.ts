import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
} from 'aws-lambda';
import handler from './util/handler';

export const main: APIGatewayProxyHandlerV2WithJWTAuthorizer = handler(
  async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
    return {
      statusCode: 200,
      body: `Hello ${event.requestContext.authorizer.jwt.claims.sub}!`,
    };
  }
);
