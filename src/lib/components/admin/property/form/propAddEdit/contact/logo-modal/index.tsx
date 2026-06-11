import {
  Card,
  Col,
  Divider,
  FormInstance,
  Image,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { UploadItem } from "@/lib/components/shared/MyFormItem";
import { ETableName } from "@/lib/core/enum";
import propertyApi from "@/services/api/property/propertyApi";
import { fileServices } from "@/services/api/services/fileServices";

const { Text } = Typography;

type Props = {
  form: FormInstance;
  open: boolean;
  onOpenChange: (val: boolean) => void;
};

const logoName = "CustomerLogo";

const LogoModal = ({ form, open, onOpenChange }: Props) => {
  const [data, setData] = useState<string[]>([]);

  const [selected, setSelected] = useState<string>(); // State to track selection

  useEffect(() => {
    const fetch = async () => {
      const res = await propertyApi.getCustomerLogo();
      setData(res.data);
    };
    fetch();
  }, []);

  return (
    <Modal
      title="Vui lòng chọn logo"
      open={open}
      //   okButtonProps={{ disabled: !image }}
      onOk={() => {
        onOpenChange(false);
      }}
      onCancel={() => {
        onOpenChange(false);
      }}
    >
      <Divider />
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space direction="vertical">
            <Text strong>Tải hình mới</Text>
            <UploadItem
              form={form}
              name={logoName}
              maxCount={1}
              model={{ TableName: ETableName.Property }}
              accept="image/*"
            />
          </Space>
        </Col>
        <Col span={24}>
          <Space direction="vertical">
            <Text strong>Logo sẵn có</Text>
            <Space wrap>
              {data.length === 0 ? (
                <Text type="secondary">Không có dữ liệu</Text>
              ) : (
                data.map((e) => (
                  <Card
                    size="small"
                    className={`custom-card ${
                      selected === e ? "selected" : ""
                    }`}
                    onClick={() => {
                      if (e === selected) {
                        setSelected(undefined);
                        form.setFieldValue(logoName, undefined);
                      } else {
                        setSelected(e);
                        const image = fileServices.mapFromString(e);
                        form.setFieldValue(logoName, image);
                      }
                    }}
                  >
                    <Image
                      src={e}
                      alt={e}
                      width={50}
                      height={50}
                      preview={false}
                    />
                  </Card>
                ))
              )}
            </Space>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

export default LogoModal;
