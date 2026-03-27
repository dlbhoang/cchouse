import { Badge, Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';

type Props = {
  value: boolean;
  title?: string;
  description?: string;
  onOkClick: () => void;
};
const BadgeConfirm = ({ title, value, description, onOkClick }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await onOkClick();
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  return (
    <Popconfirm
      title={title ?? 'Xác nhận chuyển trạng thái?'}
      description={description ?? ''}
      open={open}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Huỷ"
    >
      <Tooltip title="Chuyển trạng thái">
        <Button onClick={showPopconfirm} type="text">
          <Badge
            status={value ? 'success' : 'warning'}
            text={value ? 'Đang sử dụng' : 'Tạm ẩn'}
          />
        </Button>
      </Tooltip>
    </Popconfirm>
  );
};

export default BadgeConfirm;
