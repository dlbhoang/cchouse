import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import {Button} from 'antd';
import { ReactNode } from 'react';

type Props = {
  isModalOpen: boolean;
  children?: ReactNode;
  handleCancel: () => void;
};

const GeocodeModal = ({ isModalOpen, children, handleCancel }: Props) => {
  return (
    <LucideModal
      title="Xem thông tin vị trí"
      open={isModalOpen}
      width={1200}
      onCancel={() => {
        handleCancel();
      }}
      centered
      footer={[
        <Button key="back" onClick={handleCancel}>
          Xác nhận
        </Button>,
      ]}
    >
      {children}
    </LucideModal>
  );
};

export default GeocodeModal;
