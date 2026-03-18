import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Google from "next-auth/providers/google";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not set");
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret,
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  events: {
    async createUser({ user }) {
      if (!user.id) {
        throw new Error("User ID missing in createUser event");
      }

      await prisma.profile.create({
        data: {
          userId: user.id,
        },
      });
    },
  },
  // TODO: custom auth pages later
});
