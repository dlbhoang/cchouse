"use client";
import { FloatButton } from "antd";
import { ArrowUpIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminContext } from "@/lib/stored";

type Props = {
  href?: string;
  onClick?: () => void;
};

const FloatBtn = ({ href, onClick }: Props) => {
  const router = useRouter();
  const { smallScreen } = useAdminContext();

  return (
    <FloatButton.Group style={{ bottom: smallScreen ? 100 : undefined }}>
      <FloatButton
        shape="circle"
        type="primary"
        tooltip="Thêm mới"
        style={{ bottom: 60 }}
        icon={<PlusIcon className="size-4" />}
        onClick={() => (onClick ? onClick() : router.push(href!))}
      />
      <FloatButton.BackTop
        tooltip="Trở về đầu trang"
        icon={<ArrowUpIcon className="size-4" />}
      />
    </FloatButton.Group>
  );
};

export default FloatBtn;
