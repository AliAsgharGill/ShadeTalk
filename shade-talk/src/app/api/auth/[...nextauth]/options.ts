import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

// basically we only need knowledge about providers and callback

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const existingUser = await UserModel.findOne({
            $or: [
              { email: credentials?.email },
              { username: credentials?.username },
            ],
          });

          if (!existingUser) {
            throw new Error("User not found");
          }

          if (!existingUser.isVerified) {
            throw new Error("User not verified");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password,
            existingUser.password
          );
          if (!isPasswordCorrect) {
            const existingUser = await UserModel.findOne({
              username: credentials?.username,
            });
            if (!existingUser) {
              return null;
            }
            const isPasswordCorrect = await bcrypt.compare(
              credentials?.password,
              existingUser.password
            );
            if (!isPasswordCorrect) {
              throw new Error("Invalid password");
            }
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],

  callbacks: {
    // next-auth with session and jwt. but mostly prefer session streatgy.

    // we have modified original User interface of next-auth in *next-auth.d.ts*
    // we modified it because we want when we get token we also get other information of user like, id, verification status, isMessageAccepting and username. These all with token.

    // Get info from user and store it in token
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    // Get info from token and store it in the session
    async session({ session, token }) {
      if (token) {
        session.user.id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sing-in",
  },
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
