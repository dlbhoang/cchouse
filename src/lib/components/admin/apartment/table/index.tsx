import { Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Key } from "react";

import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { IApartmentResponse } from "@/services/api/apartment/IApartment";

const { Text } = Typography;
const columns: ColumnsType<IApartmentResponse> = [
  {
    title: "Tên chung cư / căn hộ",
    dataIndex: "Name",
    render(value, row) {
      return (
        <Space direction="vertical">
          <Text strong>{value}</Text>
          <Text type="secondary">{CombineAddress({ ...row })}</Text>
        </Space>
      );
    },
  },
];

type Props = {
  data: IApartmentResponse[];
  loading: boolean;
  defaultSelectRow?: Key[] | undefined;
  onSelect: (id: number) => void;
};
export const ApartmentTable = ({
  data,
  loading,
  defaultSelectRow,
  onSelect,
}: Props) => {
  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key,
      selectedRows: IApartmentResponse[]
    ) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      onSelect(Number(selectedRowKeys));
    },
    getCheckboxProps: (record: IApartmentResponse) => ({
      name: record.Id,
    }),
  };

  return (
    <TableNoPaging
      rowSelection={
        {
          type: "radio",
          selectedRowKeys: defaultSelectRow,
          ...rowSelection,
        } as any
      }
      loading={loading}
      data={data}
      cols={columns}
      bordered
      onRowClick={(row) => onSelect(row.Id ?? 0)}
    />
  );
};
