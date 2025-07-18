// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { JWT } from "jose";
// import { prisma } from "../prismaClient";


// export const authOptions: NextAuthOptions = {
//   session: { strategy: "jwt" },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: { username: {}, password: {} },
//       authorize: async creds => {
//         const user = await prisma.user.findUnique({ where: { username: creds!.username } });
//         if (user && user.password === creds!.password) {
//           return { id: user.id, name: user.username };
//         }
//         return null;
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) token.username = user.name;
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = { name: token.username as string };
//       return session;
//     }
//   },
//   secret: process.env.NEXTAUTH_SECRET
// };

/* eslint-disable no-param-reassign */
// import CredentialsProvider from 'next-auth/providers/credentials';

// import fetcher from './fetcher';

// const MAX_AGE_TOKEN = 60 * 60 * 24 * 7; // 1 week

// export const authOptions = {
//   session: {
//     strategy: 'jwt',
//     maxAge: MAX_AGE_TOKEN
//   },
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         try {
//           const profileResponse = await fetcher({
//             url: `/profile/${credentials.slug}`,
//             headers: {
//               authorization: `Bearer ${credentials.accessToken}`
//             }
//           });

//           const { profile } = profileResponse.data.data;

//           return profile;
//         } catch (error) {
//           return null;
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       // eslint-disable-next-line no-param-reassign
//       session.profile = token.user;
//       return session;
//     },
//     async jwt({ token, user, trigger, session }) {
//       if (trigger === 'update' && session?.name && session?.slug) {
//         token.user.name = session.name;
//         token.user.slug = session.slug;
//       }

//       if ((trigger === 'update' && session?.avatar) || session?.avatar === null) {
//         token.user.avatar = session.avatar;
//       }

//       if (user) {
//         token.user = user;
//       }
//       return token;
//     }
//   }
// };
