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
      const userData = (user ?? {}) as Record<string, any>;
      const mustChangePassword =
        userData.MustChangePassword ??
        userData.mustChangePassword ??
        token.MustChangePassword ??
        token.mustChangePassword ??
        false;

      const minimalUser = {
        Id: userData.Id ?? token.Id,
        Code: userData.Code ?? token.Code,
        Name: userData.Name ?? token.Name,
        Email: userData.Email ?? token.Email,
        Phone: userData.Phone ?? token.Phone,
        CompanyPhone: userData.CompanyPhone ?? token.CompanyPhone,
        RoleId: userData.RoleId ?? token.RoleId,
        RoleName: userData.RoleName ?? token.RoleName,
        BranchId: userData.BranchId ?? token.BranchId,
        BranchName: userData.BranchName ?? token.BranchName,
        ManagedBy: userData.ManagedBy ?? token.ManagedBy,
        Permission: userData.Permission ?? token.Permission,
        Avatar: userData.Avatar ?? token.Avatar,
        DateOfBirth: userData.DateOfBirth ?? token.DateOfBirth,
        MustChangePassword: Boolean(mustChangePassword),
        mustChangePassword: Boolean(mustChangePassword),
        token: userData.token ?? token.token,
        expiredDate: userData.expiredDate ?? token.expiredDate,
      };

      return {
        ...token,
        ...minimalUser,
      };
    },
    async session({ session, token }: any) {
      const mustChangePassword =
        token.MustChangePassword ?? token.mustChangePassword ?? false;

      session.user = {
        Id: token.Id,
        Code: token.Code,
        Name: token.Name,
        Email: token.Email,
        Phone: token.Phone,
        CompanyPhone: token.CompanyPhone,
        RoleId: token.RoleId,
        RoleName: token.RoleName,
        BranchId: token.BranchId,
        BranchName: token.BranchName,
        ManagedBy: token.ManagedBy,
        Permission: token.Permission,
        Avatar: token.Avatar,
        DateOfBirth: token.DateOfBirth,
        MustChangePassword: Boolean(mustChangePassword),
        token: token.token,
        expiredDate: token.expiredDate,
      };
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
