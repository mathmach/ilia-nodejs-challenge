import { APIGatewayProxyEventV2WithRequestContext, Context } from 'aws-lambda';

export default function handler<TRequestContext>(lambda: any) {
  return async function (
    event: APIGatewayProxyEventV2WithRequestContext<TRequestContext>,
    context: Context
  ) {
    try {
      // Run the Lambda
      return await lambda(event, context);
    } catch (e: any) {
      console.error(e);
      return {
        statusCode: 500,
        body: { error: e.message },
      };
    }
  };
}
