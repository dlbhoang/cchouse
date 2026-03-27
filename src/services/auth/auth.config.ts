import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  trustHost: true,
  providers: [    
  ],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {

      // return dayjs(token?.expiredDate as any).isAfter(dayjs());

      return !!auth?.user;
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }: any) {
      session.user = token; // eslint-disable-line no-use-before-define
      return session; // eslint-disable-line no-use-before-define
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
