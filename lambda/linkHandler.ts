import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  const link = event.queryStringParameters?.link;

  if (link) {
    const response = await fetch(link);
    const data = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'No link provided' }),
  };
};
