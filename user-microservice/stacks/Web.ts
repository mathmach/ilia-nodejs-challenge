import { use, StackContext, StaticSite } from '@serverless-stack/resources';
import { Api } from './Api';

export function Web({ stack, app }: StackContext) {
  const api = use(Api);

  const site = new StaticSite(stack, 'Site', {
    path: 'web',
    buildCommand: 'npm run build',
    buildOutput: 'dist',
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_REGION: app.region,
    },
  });

  // Show the API endpoint and other info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteUrl: site.url,
  });
}
