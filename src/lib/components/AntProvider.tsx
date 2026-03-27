"use client";
import { ConfigProvider } from "antd";
import type { Locale } from "antd/es/locale";
import React from "react";

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: "'${label}' không để trống!",
  // ...
};
const AntProvider = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) => {
  return (
    <ConfigProvider
      form={{ validateMessages }}
      locale={locale}
      theme={{
        token: {
          colorPrimary: "#89bf04",
          fontFamily: "SF-UI-Display,sans-serif",
          // 'gitbook-content-font,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
          // fontFamily: '"Be Vietnam Pro", sans-serif',
        },
        components: {
          Button: {
            dangerColor: "#faad14",
          },
          Segmented: {
            itemSelectedBg: "#89bf04",
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
