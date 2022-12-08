import { use, StackContext, StaticSite } from '@serverless-stack/resources';
import { Api } from './Api';

export function Web({ stack, app }: StackContext) {
  const { api, auth } = use(Api);

  const site = new StaticSite(stack, 'Site', {
    path: 'web',
    buildCommand: 'npm run build',
    buildOutput: 'dist',
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_REGION: app.region,
      VITE_APP_USER_POOL_ID: auth.userPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    },
  });

  // Show the API endpoint and other info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    SiteUrl: site.url,
  });
}
