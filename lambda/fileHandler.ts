import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const s3 = new S3();
const bucketName = process.env.BUCKET_NAME || '';

export const handler: APIGatewayProxyHandler = async (event) => {
  
  const dayFolder = new Date().toISOString().split('T')[0];
  const key = `${dayFolder}/${event.queryStringParameters?.filename}`;

  if (event.httpMethod === 'POST') {
    const body = Buffer.from(event.body || '', 'base64');
    await s3.putObject({
      Bucket: bucketName,
      Key: key,
      Body: body,
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File uploaded successfully' }),
    };
  } else if (event.httpMethod === 'DELETE') {
    await s3.deleteObject({
      Bucket: bucketName,
      Key: key,
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File deleted successfully' }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Unsupported method' }),
  };
};
