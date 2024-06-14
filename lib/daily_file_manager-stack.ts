import * as cdk from 'aws-cdk-lib';
import { aws_apigateway as apigateway, aws_lambda as lambda, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DailyFileManagerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fileBucket = new s3.Bucket(this, 'FileBucket');
    const imageBucket = new s3.Bucket(this, 'ImageBucket');

    const fileHandler = new lambda.Function(this, 'FileHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      // code: lambda.Code.fromAsset('dist/lambda'),
      code: lambda.Code.fromAsset('lambdajs'),
      handler: 'fileHandler.handler',
      environment: {
        BUCKET_NAME: fileBucket.bucketName,
      },
    });

    const imageHandler = new lambda.Function(this, 'ImageHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambdajs'),
      handler: 'imageHandler.handler',
      environment: {
        BUCKET_NAME: imageBucket.bucketName,
      },
    });

    const linkHandler = new lambda.Function(this, 'LinkHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambdajs'),
      handler: 'linkHandler.handler',
    });

    fileBucket.grantReadWrite(fileHandler);
    imageBucket.grantReadWrite(imageHandler);

    const api = new apigateway.RestApi(this, 'MyApi');

    const files = api.root.addResource('files');
    files.addMethod('POST', new apigateway.LambdaIntegration(fileHandler));
    files.addMethod('DELETE', new apigateway.LambdaIntegration(fileHandler));

    const images = api.root.addResource('images');
    images.addMethod('POST', new apigateway.LambdaIntegration(imageHandler));
    images.addMethod('DELETE', new apigateway.LambdaIntegration(imageHandler));

    const links = api.root.addResource('links');
    links.addMethod('GET', new apigateway.LambdaIntegration(linkHandler));
  }
}
