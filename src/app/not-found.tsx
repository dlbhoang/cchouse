"use client";
import { Result as LucideResult } from "@/lib/components/antd-lucide";
import {Button} from "antd";

import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";

export default function NotFound() {
  <LucideResult
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
