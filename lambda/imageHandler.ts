import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const s3 = new S3();
const bucketName = process.env.BUCKET_NAME || '';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("event--->",event)
  try {
    const { httpMethod, body, queryStringParameters } = event;

    if (!bucketName) {
      throw new Error('Bucket name not provided.');
    }

    if (httpMethod === 'POST') {
      if (!body) {
        throw new Error('No image data provided.');
      }

      const imageData = Buffer.from(body, 'base64');
      const filename = queryStringParameters?.filename;
      if (!filename) {
        throw new Error('Filename parameter is required.');
      }

      const dayFolder = new Date().toISOString().split('T')[0];
      const key = `${dayFolder}/${filename}`;

      await s3.putObject({
        Bucket: bucketName,
        Key: key,
        Body: imageData,
      }).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Image uploaded successfully' }),
      };
    } else if (httpMethod === 'DELETE') {
      const filename = queryStringParameters?.filename;
      if (!filename) {
        throw new Error('Filename parameter is required.');
      }

      const dayFolder = new Date().toISOString().split('T')[0];
      const key = `${dayFolder}/${filename}`;

      await s3.deleteObject({
        Bucket: bucketName,
        Key: key,
      }).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Image deleted successfully' }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Unsupported method' }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
