import { Col, Row, Timeline, Typography, theme } from "antd";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import historyApi from "@/services/api/history/historyApi";
import { IHistory } from "@/services/api/history/IHistory";
import { baseFilter } from "../../../core/configs/appConst";

const { useToken } = theme;
const { Text, Paragraph } = Typography;
type Props = {
  instanceId: number;
  TableName: string;
  oldTableName?: string;
  noteOnly?: boolean;
  refresh?: boolean;
};
const HistoryTree = ({
  instanceId,
  TableName: tableName,
  oldTableName,
  noteOnly,
  refresh,
}: Props) => {
  const [data, setData] = useState<IHistory[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await historyApi.get({
        ...baseFilter,
        InstanceId: instanceId,
        pageIndex: 1,
        TableName: tableName,
        NoteOnly: noteOnly ?? false,
      });
      setData(result.data);
    };
    fetch();
  }, [instanceId, tableName, noteOnly, refresh]);

  const { token } = useToken();

  const ellipsis = { rows: 2, expandable: true, symbol: "Xem thêm" };

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
                <Col xs={24} md={8}>
                  <Text strong ellipsis={{ tooltip: e.ColumnNameVietnamese }}>
                    {e.ColumnNameVietnamese}:{" "}
                  </Text>
                </Col>
                <Col xs={11} md={7}>
                  <Paragraph ellipsis={ellipsis}>{e.OldValue}</Paragraph>
                </Col>
                <Col xs={2}>
                  <ArrowRightIcon className="size-4" />
                </Col>
                <Col
                  xs={11}
                  md={7}
                  style={{ display: "flex", justifyContent: "center" }}
                >
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

export default HistoryTree;
