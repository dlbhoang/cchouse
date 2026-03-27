"use client";

import { Layout, Spin } from "antd";
import { ReactNode, useEffect, useState } from "react";

const { Content } = Layout;
type LayoutProps = {
  children: ReactNode;
};

export default function LoginLayout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);

  // Đảm bảo component đã mount trên client để tránh lỗi Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Trong khi đang kiểm tra session hoặc chưa mount, trả về null hoặc loading
  // để server và client khớp nhau
  if (!mounted) {
    return <Spin />; // Hoặc một cái Loading Spinner
  }

  return (
    <Layout>
      <Content
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            height: "98vh",
            backgroundImage: "url(bg.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "calc(100% - 430px)",
            position: "relative",
          }}
        >
          {/* <Row
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              zIndex: 10000,
            }}
            justify="center"
          >
            <UserAdminSwiper />
          </Row> */}
        </div>
        {children}
      </Content>
    </Layout>
  );
}
