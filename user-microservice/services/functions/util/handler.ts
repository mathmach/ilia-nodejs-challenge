import { APIGatewayProxyEventV2WithRequestContext, Context } from 'aws-lambda';

export default function handler<TRequestContext>(lambda: any) {
  return async function (
    event: APIGatewayProxyEventV2WithRequestContext<TRequestContext>,
    context: Context,
    callback: any
  ) {
    try {
      // Run the Lambda
      return await lambda(event, context, callback);
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };
}
