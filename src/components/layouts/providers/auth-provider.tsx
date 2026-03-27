"use client";
import vi_VN from "antd/locale/vi_VN";

import { SessionProvider } from "next-auth/react";
import React from "react";
import TopLoader from "@/components/ui/top-loader";
import AntProvider from "@/lib/components/AntProvider";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AntProvider locale={vi_VN}>
      <SessionProvider basePath="/api/auth">
        <TopLoader />
        {children}
      </SessionProvider>
    </AntProvider>
  );
};

export default AuthProvider;
