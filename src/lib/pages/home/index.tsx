"use client";
import { Space, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppRoutes } from "@/lib/core/configs/appRoutes";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(`${AppRoutes.property.url}?TransType=1`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Space style={{ height: "100vh" }}>
      <Spin />
    </Space>
  );
};

export default Home;
