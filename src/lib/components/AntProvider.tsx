"use client";
import { ConfigProvider } from "antd";
import type { Locale } from "antd/es/locale";
import React from "react";
import { adminDesignTheme } from "@/lib/core/configs/admin-design";

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: "'${label}' không để trống!",
  // ...
};
const AntProvider = ({
  children,
  locale,
  designTheme = false,
}: {
  children: React.ReactNode;
  locale: Locale;
  designTheme?: boolean;
}) => {
  return (
    <ConfigProvider
      form={{ validateMessages }}
      locale={locale}
      theme={{
        token: {
          colorPrimary: designTheme ? "#0688f0" : "#89bf04",
          fontFamily: designTheme ? "Inter,sans-serif" : "SF-UI-Display,sans-serif",
          ...(designTheme ? adminDesignTheme : {}),
          // 'gitbook-content-font,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
          // fontFamily: '"Be Vietnam Pro", sans-serif',
        },
        components: {
          Button: {
            dangerColor: "#faad14",
          },
          Segmented: {
            itemSelectedBg: designTheme ? "#0688f0" : "#89bf04",
            itemSelectedColor: "#ffffff",
            trackBg: "#ffffff",
          },
          // Layout: {
          //   colorBgBody: '#FAFAFA',
          // },
          Drawer: {
            colorBgElevated: "#FFFFFF",
            colorText: "#FFFFFF",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntProvider;
