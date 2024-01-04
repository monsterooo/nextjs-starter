import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";

import { env } from "@/env.mjs";
import { db } from "@/lib/db";

import { authOptions } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
      });
      // TODO add email verification
      if (!existingUser) return false;

      console.log("~~signIn 返回~~", true);
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }

      console.log("~~session 返回~~", session);
      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
      });

      if (!existingUser) return token;

      const existingAccount = await db.account.findFirst({
        where: {
          userId: existingUser.id,
        },
      });

      token.name = existingUser.name;
      token.email = existingUser.email;

      console.log("~~jwt 返回~~", token);
      return token;
    },
  },
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
  },
  ...authOptions,
});
