import Authentication from 'functions/util/authentication';
import {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResult, APIGatewayProxyEventV2
} from 'aws-lambda';
import handler from './util/handler';
import { User } from '@user-microservice/core/user';
import { Encrypt } from './util/encrypt';

export const verify = handler<APIGatewayAuthorizerResult>(async (event: APIGatewayAuthorizerEvent, context: any, callback: any) => {
  const authentication = await authenticate(event);

  if (!authentication.isValid) {
    return callback("Unauthorized");
  }

  const result: APIGatewayAuthorizerResult = {
    principalId: authentication.value?.user || 'unkown',
    policyDocument: buildPolicy(
      authentication.isValid ? 'Allow' : 'Deny',
      event.methodArn
    ),
    context: {
      ...authentication.value
    }
  };

  return result;
});

async function authenticate(event: any): Promise<any> {
  try {
    const token = getTokenOrThrow(event);
    const info = Authentication.readToken(token);
    return { isValid: true, value: info };
  } catch (error: any) {
    return { isValid: false };
  }
}

function buildPolicy(effect: string, methodArn: string) {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn,
      },
    ],
  };
}

const getTokenOrThrow = (event: any) => {
  const auth = event.authorizationToken || '';
  const [scheme, token] = auth.split(' ', 2);
  if ((scheme || '').toLowerCase() !== 'bearer') {
    throw new Error("Authorization header value did not start with 'Bearer'.");
  }
  if (!token?.length) {
    throw new Error('Authorization header did not contain a Bearer token.');
  }
  return token;
};

export const login = handler<APIGatewayProxyEventV2>(async (event: APIGatewayProxyEventV2, context: any, callback: any) => {
  const user = JSON.parse(event.body || "{}")['user'];

  if (user) {
    const found = await User.getByEmail(user.email);
    if (found) {
      const isValid = await Encrypt.comparePassword(user.password, found.password);
      if (isValid) {
        const token = Authentication.createToken({ user: found.email });
        return ({
          auth: true,
          token: token
        });
      }
    }
  }
  return callback("Unauthorized");
});
