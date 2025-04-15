import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { HttpUserPoolAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { aws_apigatewayv2, Stack } from "aws-cdk-lib";
import { configureAutoTrack } from 'aws-amplify/analytics';
import { Backend } from 'aws-cdk-lib/aws-appmesh';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as url from 'url';
import * as apigwateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});
//configure stack
// const apiStack = Stack.of(backend.auth.resources.userPool);
// //configure user pool
// const userPool = new cognito.UserPool(apiStack, 'UserPoolCog', {
//   signInAliases: {
//     email: true,
//     username: true,
//   },
//   selfSignUpEnabled: true,
//   autoVerify: { email: true },
//   signInCaseSensitive: false,
// });
// //configure client read attributes
// const clientReadAttributes = new cognito.ClientAttributes().withStandardAttributes({
//   email: true,
//   preferredUsername: true,
//   givenName: true,
//   familyName: true, 
//   birthdate: true,
//   address: true,
//   phoneNumber: true,
//   nickname: true,
// });
// //configure client write attributes
// const clientWriteAttributes = new cognito.ClientAttributes().withStandardAttributes({
//   email: true,
// });

// //configure google provider
// const googleProvicer = new cognito.UserPoolIdentityProviderGoogle(apiStack, 'GoogleProvider', {
//   userPool,
//   clientId: '34052216291-tcsb7vnfiooeud6mn71pj6sjl6puss21.apps.googleusercontent.com',
//   clientSecret: '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',
//   attributeMapping: {
//     email: cognito.ProviderAttribute.GOOGLE_EMAIL,
//     emailVerified: cognito.ProviderAttribute.GOOGLE_EMAIL_VERIFIED,
//     fullname: cognito.ProviderAttribute.GOOGLE_NAME,
//   },
//   scopes: ['email', 'profile'],
// });

// //configure facebook provider
// const facebookProvider = new cognito.UserPoolIdentityProviderFacebook(apiStack, 'FacebookProvider', {
//   userPool,
//   clientId: '693454566686159',
//   clientSecret: 'fa4414b13573726c82319f45397a48a9',
//   attributeMapping: {
//     email: cognito.ProviderAttribute.FACEBOOK_EMAIL,
//     fullname: cognito.ProviderAttribute.FACEBOOK_NAME,
//     nickname: cognito.ProviderAttribute.FACEBOOK_ID,
//   },
//   scopes: ['email', 'public_profile'],
// });

// //configure client
// const client = userPool.addClient('CloudProjectClient', {
//   readAttributes: clientReadAttributes,
//   writeAttributes: clientWriteAttributes,
//   supportedIdentityProviders: [
//     cognito.UserPoolClientIdentityProvider.GOOGLE,
//     cognito.UserPoolClientIdentityProvider.FACEBOOK,
//   ],
//   oAuth: {
//     flows: {
//       authorizationCodeGrant: true,
//     },
//     callbackUrls: ['https://todododo.com','http://localhost:3000'],
//     logoutUrls: ['https://todododo.com','http://localhost:3000'],
//     //not needed probably
//     scopes: [cognito.OAuthScope.EMAIL,cognito.OAuthScope.PROFILE],
//   },
// });
// //adds configured providers to the client
// client.node.addDependency(googleProvicer);
// client.node.addDependency(facebookProvider);

// //to setup a custom prefix domain
// const domain = userPool.addDomain('CloudProjectCognitoDomain', {
//   cognitoDomain:{
//     domainPrefix: 'cloudprojectauth',
//   }
// });

// const testLambda = new lambdaNodejs.NodejsFunction(apiStack, 'TestLambda', {
//   runtime: lambda.Runtime.NODEJS_20_X,
//   handler: 'index.handler',
//   entry: url.fileURLToPath(new URL('./custom/api/test.ts', import.meta.url)),
//   //"C:\Users\hoxerz\IdeaProjects\cloud-systems-project\cloud_app_frontend\amplify\custom\api\test.ts"
// });

// const apiGateway = new apigwateway.RestApi(apiStack,'CloudProjectApiGateway',{
//   restApiName: 'CloudProjectApiGateway',
//   deploy: true,
//   deployOptions: {
//     stageName: 'prod',
//   },
//   defaultCorsPreflightOptions: {
//     allowOrigins: apigwateway.Cors.ALL_ORIGINS,
//     allowMethods: apigwateway.Cors.ALL_METHODS,
//     allowHeaders: apigwateway.Cors.DEFAULT_HEADERS,
//   },
//   endpointTypes: [apigwateway.EndpointType.REGIONAL],
// });

// const userPoolAuthorizer = new apigwateway.CognitoUserPoolsAuthorizer(apiStack, 'UserPoolAuthorizer', {
//   cognitoUserPools: [userPool],
//   identitySource: 'method.request.header.Authorization',
// });

// const testResource = apiGateway.root.addResource('test');
// const testIntegration = new apigwateway.LambdaIntegration(testLambda);
// testResource.addMethod('GET', testIntegration, {
//   authorizer: userPoolAuthorizer,
//   authorizationType: apigwateway.AuthorizationType.COGNITO,
// });
