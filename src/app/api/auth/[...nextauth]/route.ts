import NextAuth, { type NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { compare } from 'bcryptjs';
import { ObjectId } from 'mongodb';

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Credentials | undefined): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const client = await clientPromise;
        const db = client.db();
        const dbUser = await db.collection('users').findOne({ email: credentials.email });

        if (!dbUser) {
          throw new Error('No user found');
        }

        const isValid = await compare(credentials.password, dbUser.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return user object matching the User interface
        const user: User = {
          id: dbUser._id.toString(),
          email: dbUser.email,
          username: dbUser.username,
        };

        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/',
    error: '/sign-in',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
