const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: 'eu-north-1' }); // Replace 'your-region' with your AWS region
const bucketName = process.env.BUCKET_NAME || '';

exports.handler = async (event) => {
  console.log("event--->", event);
  try {
    const { httpMethod, body, queryStringParameters, headers } = event;

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

      const contentType = headers['content-type'] || 'application/octet-stream'; // Assuming default content type if not provided

      const dayFolder = new Date().toISOString().split('T')[0];
      const key = `${dayFolder}/${filename}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: imageData,
        ContentType: contentType, // Set the content type
      }));

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

      await s3Client.send(new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }));

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
