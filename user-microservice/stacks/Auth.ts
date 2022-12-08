import { Cognito, StackContext } from '@serverless-stack/resources';

export function Auth({ stack }: StackContext) {
  const auth = new Cognito(stack, 'Auth', {
    login: ['email'],
  });

  return auth;
}
