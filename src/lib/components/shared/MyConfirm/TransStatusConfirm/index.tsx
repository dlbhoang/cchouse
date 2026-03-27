import { Input, Popconfirm } from "antd";
import { useEffect, useState } from "react";

import { TransStatusSelect } from "../../MySelect";
import { ETransType } from "@/lib/core/enum";

const { TextArea } = Input;
type Props = {
  propId: number;
  transType: ETransType;
  transStatus: number;
  handleOkClick: (status: number, reason?: string) => void;
};
export const TransStatusConfirm = ({
  propId,
  transType,

  transStatus,
  handleOkClick,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<number>();
  const [reason, setReason] = useState<string>();

  useEffect(() => {
    setStatus(transStatus);
  }, [transStatus]);

  const handleStatus = async () => {
    const val = Number(status);
    if (handleOkClick) handleOkClick(val, reason);
  };

  const title = "Bạn đang thay đổi trạng thái?";

  const confirm = async () => {
    setOpen(false);
    await handleStatus();
  };

  return (
    <Popconfirm
      title={status === 7 ? "Vui lòng nhập lý do xoá?" : title}
      description={
        status === 7 ? (
          <TextArea
            placeholder="Lý do"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        ) : (
          "Thao tác này không thể hoàn tác"
        )
      }
      open={open}
      onConfirm={confirm}
      onCancel={() => {
        setOpen(false);
        setStatus(transStatus);
      }}
      okText="Xác nhận"
      cancelText="Huỷ"
    >
      <TransStatusSelect
        transType={transType}
        value={status}
        allowClear={false}
        onChange={(val) => {
          setStatus(Number(val));
          setOpen(true);
        }}
      />
      {/* <Button danger>Delete a task</Button> */}
    </Popconfirm>
  );
};
