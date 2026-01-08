/* =============================================================================
   ALBERTI AI - AUTHENTICATION WITH AWS COGNITO
   Email/Password authentication using Cognito User Pool
   ============================================================================= */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  type InitiateAuthCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

// Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const CLIENT_ID = process.env.COGNITO_CLIENT_ID!;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

// Compute SECRET_HASH required when app client has a secret configured
function computeSecretHash(username: string): string | undefined {
  if (!CLIENT_SECRET) return undefined;

  const message = username + CLIENT_ID;
  const hmac = crypto.createHmac("sha256", CLIENT_SECRET);
  hmac.update(message);
  return hmac.digest("base64");
}

// ============================================================================
// COGNITO AUTH FUNCTIONS
// ============================================================================

export async function cognitoSignUp(
  email: string,
  password: string,
  name: string
) {
  try {
    const secretHash = computeSecretHash(email);
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      ...(secretHash && { SecretHash: secretHash }),
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
      ],
    });

    const response = await cognitoClient.send(command);
    return {
      success: true,
      userSub: response.UserSub,
      needsConfirmation: !response.UserConfirmed,
    };
  } catch (error: any) {
    console.error("Cognito SignUp Error:", error);
    return { success: false, error: error.message || "Sign up failed" };
  }
}

export async function cognitoConfirmSignUp(email: string, code: string) {
  try {
    const secretHash = computeSecretHash(email);
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      ...(secretHash && { SecretHash: secretHash }),
    });

    await cognitoClient.send(command);
    return { success: true };
  } catch (error: any) {
    console.error("Cognito Confirm Error:", error);
    return { success: false, error: error.message || "Confirmation failed" };
  }
}

export async function cognitoSignIn(email: string, password: string) {
  try {
    const secretHash = computeSecretHash(email);
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        ...(secretHash && { SECRET_HASH: secretHash }),
      },
    });

    const response: InitiateAuthCommandOutput = await cognitoClient.send(
      command
    );

    if (response.AuthenticationResult) {
      return {
        success: true,
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
      };
    }

    return { success: false, error: "Authentication failed" };
  } catch (error: any) {
    console.error("Cognito SignIn Error:", error);
    return { success: false, error: error.message || "Sign in failed" };
  }
}

// ============================================================================
// NEXTAUTH CONFIGURATION
// ============================================================================

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const result = await cognitoSignIn(
          credentials.email as string,
          credentials.password as string
        );

        if (!result.success || !result.idToken) {
          return null;
        }

        // Decode the ID token to get user info
        const payload = JSON.parse(
          Buffer.from(result.idToken.split(".")[1], "base64").toString()
        );

        return {
          id: payload.sub,
          email: payload.email,
          name: payload.name || payload.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

// ============================================================================
// CLIENT-SIDE AUTH HOOK
// ============================================================================

import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    const result = await nextAuthSignIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return result?.ok ?? false;
  };

  const signup = async (email: string, password: string, name: string) => {
    // Call our signup API route
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (data.success && !data.needsConfirmation) {
      // Auto-login after signup if no confirmation needed
      return await login(email, password);
    }

    return data;
  };

  const confirmSignup = async (email: string, code: string) => {
    const res = await fetch("/api/auth/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    return data;
  };

  const logout = async () => {
    await nextAuthSignOut({ redirect: false });
  };

  const updateUser = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    return data;
  };

  return {
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    signup,
    confirmSignup,
    logout,
    updateUser,
  };
}
