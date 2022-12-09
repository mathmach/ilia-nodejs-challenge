import {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResult
} from 'aws-lambda';
import Authentication from 'functions/util/authentication';
import handler from './util/handler';

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