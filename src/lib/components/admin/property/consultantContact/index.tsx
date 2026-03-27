import { MessageOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  QRCode,
  Row,
  Space,
  Typography,
} from "antd";
import Link from "next/link";

import { IFeedResponse } from "@/services/api/feed/IFeed";

const { Text } = Typography;

const ConsultantContact = ({ data }: { data: IFeedResponse }) => {
  return (
    <Card>
      <Space>
        <Avatar src={data?.Author?.Avatar} size="large" />
        <Space.Compact direction="vertical" block>
          <Text strong>{data?.Author?.FullName}</Text>
          {data.Author?.IsAdmin ? (
            <Text>Công ty</Text>
          ) : (
            <Text>{data?.Author?.TypeName}</Text>
          )}
        </Space.Compact>
      </Space>
      <Divider />
      <Row gutter={[10, 10]}>
        <Col span={12}>
          <Button block icon={<PhoneOutlined />}>
            <Link href={`tel:${data?.Author?.Phone}`}>Liên hệ</Link>
          </Button>
        </Col>
        <Col span={12}>
          <Button block icon={<MessageOutlined />}>
            <Link
              href={`https://zalo.me/${data?.Author?.Phone}`}
              target="_blank"
            >
              Nhắn tin
            </Link>
          </Button>
        </Col>
        <Col span={24}>
          <Button block>Hẹn xem nhà</Button>
        </Col>
      </Row>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          marginBlock: 10,
        }}
      >
        <Text>Mã QR tin đăng</Text>
        <QRCode size={80} value="https://ant.design/" />
      </div>
    </Card>
  );
};
export default ConsultantContact;
