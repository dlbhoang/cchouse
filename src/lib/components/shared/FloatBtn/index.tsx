"use client";
import { FloatButton } from "antd";
import { ArrowUpIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminContext } from "@/lib/stored";

type Props = {
  href?: string;
  onClick?: () => void;
  showAddButton?: boolean;
  mobileOnlyAddButton?: boolean;
};

const FloatBtn = ({
  href,
  onClick,
  showAddButton = true,
  mobileOnlyAddButton = false,
}: Props) => {
  const router = useRouter();
  const { smallScreen } = useAdminContext();

  return (
    <FloatButton.Group style={{ bottom: smallScreen ? 100 : undefined }}>
      {showAddButton && (
        <FloatButton
          shape="circle"
          type="primary"
          tooltip="Thêm mới"
          className={mobileOnlyAddButton ? "mobile-only-add-float-button" : undefined}
          style={{ bottom: 60 }}
          icon={<PlusIcon className="size-4" />}
          onClick={() => (onClick ? onClick() : router.push(href!))}
        />
      )}
      <FloatButton.BackTop
        tooltip="Trở về đầu trang"
        icon={<ArrowUpIcon className="size-4" />}
      />
    </FloatButton.Group>
  );
};

export default FloatBtn;
