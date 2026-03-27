import { Col, Image, Input, Row, Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Key, useState } from "react";

import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import { IProvinceResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";

const { Text } = Typography;
const columns: ColumnsType<IProvinceResponse> = [
  {
    title: "Tên",
    dataIndex: "Name",
    render(value, row) {
      return (
        <Space>
          {row.Images && (
            <Image
              src={row.Images.toString()}
              height={30}
              // width={200}
              style={{ objectFit: "cover" }}
              fallback="/logo.png"
            />
          )}
          <Text>{value}</Text>
        </Space>
      );
    },
  },
  {
    title: "Tên viết tắt",
    dataIndex: "ShortName",
    render(value) {
      return <Text>{value}</Text>;
    },
  },
];

type Props = {
  data: IProvinceResponse[];
  defaultSelectRow?: Key[] | undefined;
  onSelect: (id: number) => void;
};
export const ProvinceTable = ({ data, defaultSelectRow, onSelect }: Props) => {
  const [searchText, setSearchText] = useState("");

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key,
      selectedRows: IProvinceResponse[]
    ) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      onSelect(Number(selectedRowKeys));
    },
    getCheckboxProps: (record: IProvinceResponse) => ({
      name: record.Id,
    }),
  };

  const result = data.filter((x) => {
    if (searchText && searchText !== "") {
      return (
        x.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        x.Slug.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return x;
  });

  return (
    <Row justify="space-between" gutter={[12, 12]}>
      <Col span={24}>
        <Input
          placeholder="Tìm theo tên..."
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          allowClear
        />
      </Col>

      <Col span={24}>
        <span>
          TÌM ĐƯỢC{" "}
          <Typography.Text strong>{result.length ?? 0}</Typography.Text> KẾT QUẢ
        </span>
        <TableNoPaging
          rowSelection={
            {
              type: "radio",
              selectedRowKeys: defaultSelectRow,
              ...rowSelection,
            } as any
          }
          loading={false}
          data={result}
          cols={columns}
          bordered
          onRowClick={(row) => onSelect(row.Id ?? 0)}
        />
      </Col>
    </Row>
  );
};
