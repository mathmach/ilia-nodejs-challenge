import {
  Api as ApiGateway,
  StackContext,
  use,
} from '@serverless-stack/resources';
import { Auth } from './Auth';
import { Database } from './Database';

export function Api({ stack }: StackContext) {
  const rds = use(Database);

  // Create User Pool
  const auth = use(Auth);

  // Create Api
  const api = new ApiGateway(stack, 'Api', {
    authorizers: {
      jwt: {
        type: 'user_pool',
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: 'jwt',
      function: {
        bind: [rds],
      },
    },
    routes: {
      'GET /private': 'functions/private.main',
      'GET /public': {
        function: 'functions/public.main',
        authorizer: 'none',
      },
      'GET /wallets': {
        function: 'functions/wallets.main',
        authorizer: 'none',
      },
      'GET /wallet': {
        function: 'functions/wallet.main',
      },
    },
  });

  // attach permissions for authenticated users to the api
  auth.attachPermissionsForAuthUsers(stack, [api]);

  return { api, auth };
}
