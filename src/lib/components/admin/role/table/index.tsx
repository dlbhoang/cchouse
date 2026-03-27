import { ColumnsType } from "antd/lib/table";

import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import { IRoleResponse } from "@/lib/interfaces/IRole";

type Props = {
  data: IRoleResponse[];
  loading: boolean;
  // onSelect: (val: IUserAdminV1Response) => void;
};

const RoleTable = ({ data, loading }: Props) => {
  const cols: ColumnsType<IRoleResponse> = [
    {
      title: "Mã",
      dataIndex: "Code",
      sorter: true,
    },
    {
      title: "Tên",
      dataIndex: "Name",
    },
    {
      title: "SL thành viên",
      dataIndex: "NumberOfUsers",
      align: "center",
    },
  ];

  return (
    <TableNoPaging
      loading={loading}
      data={data}
      cols={cols}
      // defaultSelectRow={[1]}
      // onSelect={onSelect}
    />
  );
};

export default RoleTable;
