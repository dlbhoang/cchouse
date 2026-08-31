"use client";
import vi_VN from "antd/locale/vi_VN";

import { SessionProvider } from "next-auth/react";
import React from "react";
import TopLoader from "@/components/ui/top-loader";
import AntProvider from "@/lib/components/AntProvider";

const AuthProvider = ({ children, session }: { children: React.ReactNode; session?: any }) => {
  return (
    <AntProvider locale={vi_VN}>
      <SessionProvider basePath="/api/auth" session={session} refetchOnWindowFocus={false} refetchInterval={5 * 60}>
        <TopLoader />
        {children}
      </SessionProvider>
    </AntProvider>
  );
};

export default AuthProvider;
