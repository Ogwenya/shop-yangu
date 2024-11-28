import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtVerify } from "jose";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v0/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email,
              password,
              account_type: "administrator",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await res.json();

        if (result.access_token) {
          const { payload } = await jwtVerify(
            result.access_token,
            new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
          );

          return { payload, access_token: result.access_token };
        } else {
          throw new Error(result.message);
        }
      },
    }),
  ],

  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, trigger, user, session }) {
      if (trigger === "update") {
        const { payload } = await jwtVerify(
          session,
          new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
        );

        token.user = payload;
        token.access_token = session;
      }

      if (user) {
        token.user = user.payload;
        token.access_token = user.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.access_token = token.access_token;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
