import NextAuth from 'next-auth'

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      username: string;
      role: string;
    } & Session["user"];
  }

  interface User {
    userId: string;
    username: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    username: string;
    role: string;
  }
}