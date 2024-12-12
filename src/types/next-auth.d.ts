import 'next-auth';
import { DefaultSession } from 'next-auth';
import { ObjectId } from 'mongodb';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    email: string;
    username: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
  }
}
