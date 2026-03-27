import { Button, Popconfirm } from 'antd';
import { CSSProperties, ReactNode, useState } from 'react';

import { NotiBase } from '../NotiBase';

type Props = {
  title?: string;
  description?: ReactNode | string;
  type: 'icon' | 'text';
  icon?: ReactNode;
  btnText?: string;
  size?: 'small' | 'middle' | 'large';
  btnShape?: 'circle' | 'default' | 'round';
  btnType?: 'link' | 'text' | 'default' | 'ghost' | 'primary' | 'dashed';
  danger?: boolean;
  block?: boolean;
  style?: CSSProperties;
  onOkClick: () => void;
};
const BtnConfirm = ({
  title,
  description,
  btnText,
  btnShape,
  btnType,
  danger,
  type,
  icon,
  onOkClick,
  ...props
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      await onOkClick();
      setOpen(false);
    } catch (e: any) {
      NotiBase('error', e?.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Popconfirm
      title={title ?? 'Xác nhận xoá dữ liệu?'}
      description={description ?? 'Thao tác này không thể hoàn tác'}
      open={open}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={() => setOpen(false)}
      okText="Xác nhận"
      cancelText="Huỷ"
    >
      {type === 'text' ? (
        <Button
          danger={danger}
          shape={btnShape}
          type={btnType as any}
          onClick={showPopconfirm}
          {...props}
        >
          {btnText}
        </Button>
      ) : (
        <Button
          danger={danger}
          type={btnType as any}
          shape={btnShape}
          onClick={showPopconfirm}
          icon={icon}
          {...props}
        />
      )}
    </Popconfirm>
  );
};

export default BtnConfirm;
