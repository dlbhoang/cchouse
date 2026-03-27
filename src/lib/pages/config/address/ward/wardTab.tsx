import { EditOutlined } from "@ant-design/icons";
import { Button, Col, Image, Input, Row, Space, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";

// import DistrictFilter from '../district/districtFilter';
import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import type { IWardResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import wardApi from "@/services/api/wardApi";

import EditWard from "./editWard";

type Props = {
  districtId: number;
  //  handleMutate: () => void;
};
const WardTab = ({ districtId }: Props) => {
  const [open, setOpen] = useState(false);
  const [wardItem, setWardItem] = useState<IWardResponse>();

  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState<IWardResponse[]>();

  const { data, isValidating, mutate } = wardApi.useGet({
    pageIndex: 1,
    pageSize: 1000,
    DistrictId: districtId,
  });

  useEffect(() => {
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId]);

  const handleEdit = (Ward: IWardResponse) => {
    setWardItem(Ward);
    setOpen(true);
  };

  const handleSearch = (value: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(value.target.value);
  };

  useEffect(() => {
    if (searchText && searchText !== "") {
      const filtered = data?.data.filter(
        (item) =>
          item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.Slug.toLowerCase().includes(searchText.toLowerCase())
      );
      setResult(filtered);
    } else {
      setResult(data?.data);
    }
  }, [data?.data, searchText]);

  const cols: ColumnsType<IWardResponse> = [
    {
      title: "STT",
      dataIndex: "Id",
    },
    {
      title: "Phường",
      dataIndex: "Name",
      render: (value, row) => (
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
          <Typography.Text>{value}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "Tên viết tắt",
      dataIndex: "ShortName",
    },
    {
      title: "Thao tác",
      dataIndex: "Id",
      render(value, record) {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Input
          placeholder="Tìm phường"
          onChange={(val) => handleSearch(val)}
          value={searchText}
          allowClear
        />
      </Col>
      <Col span={24}>
        <TableNoPaging data={result ?? []} cols={cols} loading={isValidating} />
      </Col>
      <EditWard
        isModalOpen={open}
        model={wardItem}
        handleCancel={() => {
          setWardItem(undefined);
          setOpen(false);
        }}
        handleMutate={mutate}
      />
    </Row>
  );
};

export default WardTab;
