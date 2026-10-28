import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import {Button, Col, QRCode, Row} from 'antd';

type Props = {
  isModalOpen: boolean;
  handleCancel: () => void;
};

const UserAdminQRModal = ({ isModalOpen, handleCancel }: Props) => {
  const downloadQRCode = () => {
    const canvas = document
      .getElementById('userQR')
      ?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.download = 'QRCode.png';
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <LucideModal
      open={isModalOpen}
      onCancel={() => {
        handleCancel();
      }}
      footer={null}
      centered
    >
      <Row>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
          <div id="userQR">
            <QRCode
              size={300}
              errorLevel="Q"
              value="https://cchouse.vn/"
              icon="/logo.png"
              iconSize={60}
              style={{ marginBottom: 10 }}
            />
          </div>
        </Col>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={downloadQRCode}>Tải xuống</Button>
        </Col>
      </Row>
    </LucideModal>
  );
};

export default UserAdminQRModal;
