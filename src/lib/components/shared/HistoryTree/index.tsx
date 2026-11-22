import { Alert, Button, Empty, Spin, Typography } from "antd";
import { MoveRight } from "lucide-react";
import useSWR from "swr";

import { baseFilter } from "@/lib/core/configs/appConst";
import historyApi from "@/services/api/history/historyApi";
import { HistoryEntry } from "./entry";
import styles from "./history.module.css";

const ellipsis = { rows: 2, expandable: true, symbol: "Xem thêm" };

type Props = {
  instanceId: number;
  TableName: string;
  noteOnly?: boolean;
  refresh?: boolean;
};

const HistoryTree = ({ instanceId, TableName, noteOnly = false, refresh = true }: Props) => {
  const { data, error, isLoading, mutate } = useSWR(
    refresh ? ["history", TableName, instanceId, noteOnly] as const : null,
    async ([, table, id, notes]) => {
      const response = await historyApi.get({
        ...baseFilter,
        InstanceId: id,
        pageIndex: 1,
        pageSize: 100,
        TableName: table,
        NoteOnly: notes,
      });
      return response.data ?? [];
    },
  );

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Không tải được lịch sử"
        action={<Button onClick={() => void mutate()}>Thử lại</Button>}
      />
    );
  }
  if (isLoading) return <Spin tip="Đang tải lịch sử…"><div style={{ minHeight: 80 }} /></Spin>;
  if (!data?.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có lịch sử" />;

  return (
    <ol className={styles.entries}>
      {data.map((item, index) => (
        <HistoryEntry
          key={item.Id}
          timestamp={item.ActionDate}
          actor={item.UserAdmin?.Name}
          action={noteOnly && index === 0 ? "Ghi chú" : undefined}
        >
          {item.HistoryDetails.map((detail) => (
            <div key={detail.Id ?? detail.ColumnName} className={styles.change}>
              <span>{detail.ColumnNameVietnamese}:</span>
              <Typography.Paragraph ellipsis={ellipsis}>{detail.OldValue || "Trống"}</Typography.Paragraph>
              <MoveRight size={24} aria-label="thành" />
              <Typography.Paragraph strong ellipsis={ellipsis}>{detail.NewValue || "Trống"}</Typography.Paragraph>
            </div>
          ))}
        </HistoryEntry>
      ))}
    </ol>
  );
};

export default HistoryTree;
