import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      callbackUrls: ["http://localhost:3000"],
      logoutUrls: ["http://localhost:3000"],
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
        scopes: ["email", "profile"],
        attributeMapping: {
          email: "email",
          emailVerified: "email_verified",
          fullname: "name",
        },
      },
      facebook: {
        clientId: secret("FACEBOOK_CLIENT_ID"),
        clientSecret: secret("FACEBOOK_CLIENT_SECRET"),
        scopes: ["email", "public_profile"],
        attributeMapping: {
          email: "email",
          fullname: "name",
        }
      }
    }
  }
});
