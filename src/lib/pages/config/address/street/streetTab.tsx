import { Col, Image, Input, Row, Space, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { PlusIcon, SquarePenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import type { IStreetResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import streetApi from "@/services/api/streetApi";
import AddEditStreet from "./addEditStreet";

type Props = {
  provinceId: number;
  districtId: number;
  //  handleMutate: () => void;
};
const StreetTab = ({ provinceId, districtId }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IStreetResponse>();

  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState<IStreetResponse[]>();

  const { data, isValidating, mutate } = streetApi.useGet({
    pageIndex: 1,
    pageSize: 1000,
    DistrictId: districtId,
  });

  useEffect(() => {
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId]);

  const handleEdit = (Ward: IStreetResponse) => {
    setSelectedItem(Ward);
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

  const cols: ColumnsType<IStreetResponse> = [
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
              variant="ghost"
              size="icon-sm"
              onClick={() => handleEdit(record)}
            >
              <SquarePenIcon />
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Space.Compact
          direction="horizontal"
          style={{ width: "100%", paddingBottom: 10 }}
        >
          <Input
            placeholder="Tìm theo tên"
            onChange={(val) => handleSearch(val)}
            value={searchText}
            allowClear
          />
          <Tooltip title="Tạo mới">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setOpen(true)}
            >
              <PlusIcon />
            </Button>
          </Tooltip>
        </Space.Compact>
      </Col>
      <Col span={24}>
        <TableNoPaging data={result ?? []} cols={cols} loading={isValidating} />
      </Col>
      <AddEditStreet
        isModalOpen={open}
        model={selectedItem}
        provinceId={provinceId}
        districtId={districtId}
        handleCancel={() => {
          setSelectedItem(undefined);
          setOpen(false);
        }}
      />
    </Row>
  );
};

export default StreetTab;
