import { ConfigProvider, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useState } from 'react';

interface IListData<T> {
  data: T[];
  cols: ColumnsType<T>;
  rowSelection?: TableRowSelection<T> | undefined;
  loading: boolean;
  bordered?: boolean | undefined;
  emptyContent?: React.ReactNode;
  onRowClick?: (record: T) => void;
}

function TableNoPaging<T>({
  data,
  cols,
  loading,
  rowSelection,
  bordered,
  onRowClick,
  emptyContent,
}: IListData<T>) {
  const [waitingData, setWaitingData] = useState(0);

  const timeout = setTimeout(() => {
    if (loading && waitingData < 10) {
      setWaitingData(waitingData + 1);
    }
  }, 1000);

  if (waitingData === 10) clearTimeout(timeout);

  const handleRow = (record: T) => {
    if (onRowClick) {
      return {
        onClick: () => onRowClick(record),
      };
    }
    return {};
  };

  return (
    <ConfigProvider
      renderEmpty={() =>
        emptyContent || (
          <div style={{ textAlign: 'center' }}>
            <p>Không tìm thấy dữ liệu</p>
          </div>
        )
      }
    >
      <Table
        rowKey="Id"
        size="small"
        rowSelection={rowSelection as any}
        columns={cols as any}
        dataSource={data as any}
        pagination={false}
        bordered={bordered}
        loading={waitingData === 10 ? false : loading}
        onRow={(record: T) => handleRow(record)}
        scroll={{ x: 'max-content' }}
      />
    </ConfigProvider>
  );
}

export default TableNoPaging;
