import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import User from "@/lib/models/userModel";
import { connectDB } from "@/lib/db";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        await connectDB();

        const { username, password } = credentials;

        // Get user from database
        const user = await User.findOne({ username });

        if (!user) {
          throw new Error("Incorrect username");
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        // generate jwt token
        const payload = {
          id: user._id,
          username: user.username,
          email: user.email,
        };

        const access_token = await new SignJWT(payload)
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("24h")
          .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET));

        return { payload, access_token };
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
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, session }) {
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
