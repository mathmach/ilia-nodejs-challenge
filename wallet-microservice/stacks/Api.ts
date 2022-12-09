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

  // Show the resource info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    SecretArn: rds.secretArn,
    ClusterIdentifier: rds.clusterIdentifier,
  });
}
