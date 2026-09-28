import { Col, Row, Timeline, Typography, theme } from "antd";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import historyApi from "@/services/api/history/historyApi";
import type { IHistory } from "@/services/api/history/IHistory";
import { baseFilter } from "../../../core/configs/appConst";

const { useToken } = theme;
const { Text, Paragraph } = Typography;
const ellipsis = { rows: 2, expandable: true, symbol: "Xem thêm" };

type Props = {
  instanceId: number;
  TableName: string;
  noteOnly?: boolean;
  refresh?: boolean;
};

const HistoryTree = ({
  instanceId,
  TableName: tableName,
  noteOnly,
  refresh,
}: Props) => {
  const [data, setData] = useState<IHistory[]>([]);
  const { token } = useToken();

  useEffect(() => {
    let cancelled = false;
    const fetchHistory = async () => {
      try {
        const result = await historyApi.get({
          ...baseFilter,
          InstanceId: instanceId,
          pageIndex: 1,
          pageSize: 100,
          TableName: tableName,
          NoteOnly: noteOnly ?? false,
        });
        if (!cancelled) setData(result.data ?? []);
      } catch {
        if (!cancelled) setData([]);
      }
    };

    fetchHistory();
    return () => {
      cancelled = true;
    };
  }, [instanceId, tableName, noteOnly, refresh]);

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
              <Col><Text>{item.ActionDate}</Text></Col>
              <Col>
                <Text>{item.UserAdmin?.Name}</Text>
              </Col>
            </Row>
            {item.HistoryDetails.map((detail) => (
                <Row key={`${item.Id}_${detail.ColumnNameVietnamese}`} gutter={[12, 12]}>
                  <Col xs={24} md={8}>
                    <Text strong ellipsis={{ tooltip: detail.ColumnNameVietnamese }}>
                      {detail.ColumnNameVietnamese}:{" "}
                    </Text>
                  </Col>
                  <Col xs={11} md={7}>
                    <Paragraph ellipsis={ellipsis}>{detail.OldValue || "(trống)"}</Paragraph>
                  </Col>
                  <Col xs={2}><ArrowRightIcon className="size-4" /></Col>
                  <Col xs={11} md={7} style={{ display: "flex", justifyContent: "center" }}>
                    <Paragraph ellipsis={ellipsis}>{detail.NewValue || "(trống)"}</Paragraph>
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
