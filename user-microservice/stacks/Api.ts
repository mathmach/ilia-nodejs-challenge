import {
  Api as ApiGateway,
  StackContext,
  use,
} from '@serverless-stack/resources';
import { Auth } from './Auth';
import { Database } from './Database';
import { sharedEnvironment } from './env';

export function Api({ stack }: StackContext) {
  const rds = use(Database);

  // Create User Pool
  const auth = use(Auth);

  // Create Api
  const api = new ApiGateway(stack, 'Api', {
    authorizers: {
      jwt: {
        type: 'lambda',
        function: auth
      },
    },
    defaults: {
      authorizer: 'jwt',
      function: {
        bind: [rds],
        environment: sharedEnvironment,
      }
    },
    routes: {
      'POST /auth': {
        function: 'functions/auth.login',
        authorizer: 'none',
      },
      'POST /users': {
        function: 'functions/users/users.post',
        authorizer: 'none',
      },
      'GET /users': {
        function: 'functions/users/users.get',
      },
      'GET /users/{id}': {
        function: 'functions/users/id/usersId.get',
      },
      'PATCH /users/{id}': {
        function: 'functions/users/id/usersId.put',
      },
      'DELETE /users/{id}': {
        function: 'functions/users/id/usersId.del',
      },
      'GET /balance': {
        function: 'functions/balance.get',
      },
      'POST /transactions': {
        function: 'functions/transactions.post',
      },
      'GET /transactions': {
        function: 'functions/transactions.get',
      },
    },
  });

  return api;
}
