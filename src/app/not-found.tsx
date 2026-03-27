"use client";
import { Button, Result } from "antd";

import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";

export default function NotFound() {
  <Result
    status="404"
    title="404"
    subTitle="Không tìm thấy trang mong muốn!"
    extra={
      <Button
        type="primary"
        href={`${AppRoutes.property.url}?TransType=${ETransType.sell}`}
      >
        Trang chủ
      </Button>
    }
  />;
}
