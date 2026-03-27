import { Input, Space } from "antd";
import { useState } from "react";

import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import propertyApi from "@/services/api/property/propertyApi";

type Props = {
  propId: number;
  currentStatus: number;
  handleOkClick?: () => void;
};

const { TextArea } = Input;

const PropStatusActions = ({ propId, currentStatus, handleOkClick }: Props) => {
  const [reason, setReason] = useState<string>();
  const handleStatus = async (status: number, note?: string) => {
    await propertyApi.quickUpdate({ Id: propId, Status: status, Note: note });
    if (handleOkClick) handleOkClick();
  };

  const title = "Bạn đang thay đổi trạng thái?";

  return (
    <Space>
      {currentStatus !== 2 && (
        <BtnConfirm
          title={title}
          type="text"
          btnText="Đã giao dịch"
          btnType="default"
          onOkClick={async () => handleStatus(2)}
        />
      )}
      {currentStatus !== 1 && (
        <BtnConfirm
          title={title}
          type="text"
          btnText="Đang bán"
          btnType="default"
          onOkClick={async () => handleStatus(1)}
        />
      )}
      <BtnConfirm
        title={title}
        type="text"
        btnText="Tạm ngưng"
        btnType="dashed"
        danger
        onOkClick={async () => handleStatus(3)}
      />
      <BtnConfirm
        title="Vui lòng nhập lý do xoá?"
        description={
          <TextArea
            placeholder="Lý do"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        }
        type="text"
        btnText="Chờ xoá"
        btnType="default"
        danger
        onOkClick={async () => {
          if (reason) handleStatus(7, reason);
          else throw new Error("Chưa nhập lý do");
        }}
      />
    </Space>
  );
};

export default PropStatusActions;
