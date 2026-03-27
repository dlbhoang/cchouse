import { EditOutlined, EyeFilled, EyeOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Image, Row, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { FormatDateTime } from "@/lib/core/utils/myFormat";
import type { INewsResponse } from "@/services/api/news/INews";

const { Text, Paragraph } = Typography;
const { Meta } = Card;
type Props = {
  item: INewsResponse;
  onPreview: (item: INewsResponse) => void;
};

const NewItem = ({ item, onPreview }: Props) => {
  const router = useRouter();

  return (
    <Badge.Ribbon
      text={item.StatusName}
      color={item.Status === 0 ? "orange" : "blue"}
    >
      <Card
        size="small"
        actions={[
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`${AppRoutes.news.url}/edit/${item.Id}`)}
          >
            Chỉnh sửa
          </Button>,
          <Button icon={<EyeOutlined />} onClick={() => onPreview(item)}>
            Xem tin
          </Button>,
        ]}
        title={item.CreatedBy}
      >
        <Row align={"middle"} gutter={[12, 12]}>
          <Col span={8}>
            <Image src={item.Thumbnail.toString()} />
          </Col>
          <Col span={16}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Link href={`${AppRoutes.news.url}/edit/${item.Id}`}>
                <Paragraph
                  strong
                  ellipsis={{
                    rows: 2,
                    tooltip: item.Title,
                  }}
                >
                  {item.Title}
                </Paragraph>
              </Link>
              <Row justify="space-between">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {FormatDateTime(item.UpdatedDate ?? item.CreatedDate)}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.ViewCount} <EyeFilled />
                </Text>
              </Row>
              <Paragraph
                type="secondary"
                ellipsis={{ rows: 3, expandable: true, symbol: "xem thêm" }}
              >
                {item.Summary}
              </Paragraph>
            </Space>
          </Col>
        </Row>
      </Card>
    </Badge.Ribbon>
  );
};

export default NewItem;
