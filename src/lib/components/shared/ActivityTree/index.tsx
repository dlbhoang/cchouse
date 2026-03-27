import { Col, Row, Timeline, Typography, theme } from "antd";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import historyApi from "@/services/api/history/historyApi";
import { IHistory } from "@/services/api/history/IHistory";

const { useToken } = theme;
const { Text, Paragraph } = Typography;
type Props = {
  userId?: number;
  tableName?: string;
};
const ActivityTree = ({ userId, tableName }: Props) => {
  const [data, setData] = useState<IHistory[]>([]);
  // const [oldData, setOldData] = useState<IHistory[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await historyApi.get({
        UserId: userId,
        pageIndex: 1,
        pageSize: 30,
        TableName: tableName,
      });
      setData(result.data);
    };
    fetch();
  }, [userId]);

  const { token } = useToken();

  const ellipsis = { rows: 1, expandable: true, symbol: "Xem thêm" };

  return data.length > 0 ? (
    <div style={{ maxHeight: 500, overflow: "auto", padding: 10 }}>
      <Timeline>
        {data.map((item) => (
          <Timeline.Item key={item.Id}>
            <Row
              style={{ borderBlockEnd: `1px solid ${token.colorPrimary}` }}
              gutter={[12, 12]}
              justify="space-between"
            >
              <Col>
                <Text>{item.ActionDate}</Text>
              </Col>
              <Col>
                <Text>{item.UserAdmin.Name}</Text>
              </Col>
            </Row>
            {item.HistoryDetails.map((e) => (
              <Row
                key={`${item.Id}_${e.ColumnNameVietnamese}`}
                gutter={[12, 12]}
              >
                <Col span={6}>
                  <Text strong ellipsis={{ tooltip: e.ColumnNameVietnamese }}>
                    {e.ColumnNameVietnamese}:{" "}
                  </Text>
                </Col>
                <Col span={8}>
                  <Paragraph ellipsis={ellipsis}>{e.OldValue}</Paragraph>
                </Col>
                <Col span={2}>
                  <ArrowRightIcon />
                </Col>
                <Col span={8}>
                  <Paragraph ellipsis={ellipsis}>{e.NewValue}</Paragraph>
                </Col>
              </Row>
            ))}
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  ) : (
    <Row align="middle" justify="center">
      <Col>Không có dữ liệu</Col>
    </Row>
  );
};

export default ActivityTree;
