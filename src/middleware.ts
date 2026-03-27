import NextAuth from 'next-auth';
import { authConfig } from './services/auth/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/', '/admin/:path*'],
};
