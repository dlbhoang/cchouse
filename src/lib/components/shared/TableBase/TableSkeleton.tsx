import { Skeleton, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./TableSkeleton.module.css";

interface SkeletonTableProps {
  columns: ColumnsType<any>;
  rowCount?: number;
}

const SkeletonCell = () => (
  <div className={styles["skeleton-cell"]}>
    <Skeleton
      active
      paragraph={{ rows: 1 }}
      title={false}
      style={{ marginBottom: 0 }}
    />
  </div>
);

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  columns,
  rowCount = 5,
}) => {
  const skeletonColumns = columns.map((col: any) => ({
    ...col,
    render: () => <SkeletonCell />,
  }));

  const skeletonData = Array.from({ length: rowCount }).map((_, index) => ({
    key: index,
    Id: index,
  }));

  return (
    <div className={styles["skeleton-table-wrapper"]}>
      <Table
        columns={skeletonColumns}
        dataSource={skeletonData}
        pagination={false}
        rowKey="key"
        size="small"
        scroll={{ x: 1200 }}
      />
    </div>
  );
};
