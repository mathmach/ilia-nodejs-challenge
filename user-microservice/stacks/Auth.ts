import { Function, StackContext, use } from '@serverless-stack/resources';
import { Database } from './Database';
import { sharedEnvironment } from './env';

export function Auth({ stack }: StackContext) {
  const rds = use(Database);

  const authorize = new Function(stack, 'Auth', {
    handler: 'functions/auth.verify',
    environment: sharedEnvironment,
    bind: [rds],
  });

  return authorize;
}
