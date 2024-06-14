"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyFileManagerStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
class DailyFileManagerStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const fileBucket = new aws_cdk_lib_1.aws_s3.Bucket(this, 'FileBucket');
        const imageBucket = new aws_cdk_lib_1.aws_s3.Bucket(this, 'ImageBucket');
        const fileHandler = new aws_cdk_lib_1.aws_lambda.Function(this, 'FileHandler', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.NODEJS_20_X,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('dist/lambda'),
            handler: 'fileHandler.handler',
            environment: {
                BUCKET_NAME: fileBucket.bucketName,
            },
        });
        const imageHandler = new aws_cdk_lib_1.aws_lambda.Function(this, 'ImageHandler', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.NODEJS_20_X,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('dist/lambda'),
            handler: 'imageHandler.handler',
            environment: {
                BUCKET_NAME: imageBucket.bucketName,
            },
        });
        const linkHandler = new aws_cdk_lib_1.aws_lambda.Function(this, 'LinkHandler', {
            runtime: aws_cdk_lib_1.aws_lambda.Runtime.NODEJS_20_X,
            code: aws_cdk_lib_1.aws_lambda.Code.fromAsset('dist/lambda'),
            handler: 'linkHandler.handler',
        });
        fileBucket.grantReadWrite(fileHandler);
        imageBucket.grantReadWrite(imageHandler);
        const api = new aws_cdk_lib_1.aws_apigateway.RestApi(this, 'MyApi');
        const files = api.root.addResource('files');
        files.addMethod('POST', new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(fileHandler));
        files.addMethod('DELETE', new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(fileHandler));
        const images = api.root.addResource('images');
        images.addMethod('POST', new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(imageHandler));
        images.addMethod('DELETE', new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(imageHandler));
        const links = api.root.addResource('links');
        links.addMethod('GET', new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(linkHandler));
    }
}
exports.DailyFileManagerStack = DailyFileManagerStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFpbHlfZmlsZV9tYW5hZ2VyLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGFpbHlfZmlsZV9tYW5hZ2VyLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyw2Q0FBK0Y7QUFFL0YsOENBQThDO0FBRTlDLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFVBQVUsR0FBRyxJQUFJLG9CQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNyRCxNQUFNLFdBQVcsR0FBRyxJQUFJLG9CQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUV2RCxNQUFNLFdBQVcsR0FBRyxJQUFJLHdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDM0QsT0FBTyxFQUFFLHdCQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLHdCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7WUFDMUMsT0FBTyxFQUFFLHFCQUFxQjtZQUM5QixXQUFXLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLFVBQVUsQ0FBQyxVQUFVO2FBQ25DO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSx3QkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELE9BQU8sRUFBRSx3QkFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLElBQUksRUFBRSx3QkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1lBQzFDLE9BQU8sRUFBRSxzQkFBc0I7WUFDL0IsV0FBVyxFQUFFO2dCQUNYLFdBQVcsRUFBRSxXQUFXLENBQUMsVUFBVTthQUNwQztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLElBQUksd0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUMzRCxPQUFPLEVBQUUsd0JBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsd0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUMxQyxPQUFPLEVBQUUscUJBQXFCO1NBQy9CLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV6QyxNQUFNLEdBQUcsR0FBRyxJQUFJLDRCQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLDRCQUFVLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUN2RSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLDRCQUFVLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUV6RSxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLDRCQUFVLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLDRCQUFVLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUUzRSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLDRCQUFVLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0NBQ0Y7QUEvQ0Qsc0RBK0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IGF3c19hcGlnYXRld2F5IGFzIGFwaWdhdGV3YXksIGF3c19sYW1iZGEgYXMgbGFtYmRhLCBhd3NfczMgYXMgczMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbi8vIGltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcblxuZXhwb3J0IGNsYXNzIERhaWx5RmlsZU1hbmFnZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGZpbGVCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdGaWxlQnVja2V0Jyk7XG4gICAgY29uc3QgaW1hZ2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdJbWFnZUJ1Y2tldCcpO1xuXG4gICAgY29uc3QgZmlsZUhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdGaWxlSGFuZGxlcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdkaXN0L2xhbWJkYScpLFxuICAgICAgaGFuZGxlcjogJ2ZpbGVIYW5kbGVyLmhhbmRsZXInLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgQlVDS0VUX05BTUU6IGZpbGVCdWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbWFnZUhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdJbWFnZUhhbmRsZXInLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnZGlzdC9sYW1iZGEnKSxcbiAgICAgIGhhbmRsZXI6ICdpbWFnZUhhbmRsZXIuaGFuZGxlcicsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBCVUNLRVRfTkFNRTogaW1hZ2VCdWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBsaW5rSGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0xpbmtIYW5kbGVyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2Rpc3QvbGFtYmRhJyksXG4gICAgICBoYW5kbGVyOiAnbGlua0hhbmRsZXIuaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICBmaWxlQnVja2V0LmdyYW50UmVhZFdyaXRlKGZpbGVIYW5kbGVyKTtcbiAgICBpbWFnZUJ1Y2tldC5ncmFudFJlYWRXcml0ZShpbWFnZUhhbmRsZXIpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnTXlBcGknKTtcblxuICAgIGNvbnN0IGZpbGVzID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2ZpbGVzJyk7XG4gICAgZmlsZXMuYWRkTWV0aG9kKCdQT1NUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZmlsZUhhbmRsZXIpKTtcbiAgICBmaWxlcy5hZGRNZXRob2QoJ0RFTEVURScsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGZpbGVIYW5kbGVyKSk7XG5cbiAgICBjb25zdCBpbWFnZXMgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnaW1hZ2VzJyk7XG4gICAgaW1hZ2VzLmFkZE1ldGhvZCgnUE9TVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGltYWdlSGFuZGxlcikpO1xuICAgIGltYWdlcy5hZGRNZXRob2QoJ0RFTEVURScsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGltYWdlSGFuZGxlcikpO1xuXG4gICAgY29uc3QgbGlua3MgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnbGlua3MnKTtcbiAgICBsaW5rcy5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGxpbmtIYW5kbGVyKSk7XG4gIH1cbn1cbiJdfQ==