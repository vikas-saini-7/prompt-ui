import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcrypt";
import clientPromise from "./mongodb";
import { User, userCollectionName } from "@/models/User";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials are not defined");
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection(userCollectionName);

        const user = (await usersCollection.findOne({
          email: credentials.email,
        })) as User | null;

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!passwordsMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id?.toString() || "",
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth or Credentials user data to the token right after signin
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
