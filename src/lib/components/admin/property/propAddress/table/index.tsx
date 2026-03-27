import { Button, Space } from "antd";
import { ColumnsType } from "antd/lib/table";

import TableBase from "@/lib/components/shared/TableBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { IDuplicateAddress } from "@/lib/interfaces/Property/IDuplicateAddress";

type Props = {
  total: number;
  data: IDuplicateAddress[];
  loading: boolean;
  searchOptions: ISearchOptions;
  handleRequestModal: (item: IDuplicateAddress) => void;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
  // handleMutate: () => void;
};
export const PropAddressTable = ({
  total,
  data,
  loading,
  searchOptions,
  handleRequestModal,
  onPageIndexChange,
}: // handleMutate,
Props) => {
  const cols: ColumnsType<IDuplicateAddress> = [
    {
      title: "Số nhà",
      dataIndex: "AddressNumber",
    },
    {
      title: "Đường",
      dataIndex: "StreetName",
    },
    {
      title: "Phường/Xã",
      dataIndex: "WardName",
    },
    {
      title: "Quận/Huyện",
      dataIndex: "DistrictName",
    },
    {
      title: "Mã BĐS trùng",
      dataIndex: "PropRefs",
    },
    {
      key: "action",
      title: "Thao tác",
      align: "center",
      render: (value, record) => {
        return (
          <Space>
            <Button onClick={() => handleRequestModal(record)}>Kiểm tra</Button>
          </Space>
        );
      },
    },
  ];

  return (
    <TableBase
      loading={loading}
      total={total}
      searchOptions={searchOptions}
      data={data}
      cols={cols}
      onPageIndexChange={onPageIndexChange}
    />
  );
};
