/* eslint-disable no-bitwise */
import { Checkbox, FormInstance } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import { IRoleResponse, ISysPermission } from "@/lib/interfaces/IRole";
import roleApi from "@/services/api/roleApi";
import CheckPermission from "@/services/auth/common";

type Props = {
  role: IRoleResponse;
  form: FormInstance;
};

const PermissionConfigs = ({ role, form }: Props) => {
  // const [permission, setPermission] = useState<number>(role.Permission);
  const [permissions, setPermissions] = useState<number[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [data, setData] = useState<ISysPermission[]>([]);

  const { data, isLoading } = roleApi.usePermission();

  // useEffect(() => {
  //   setLoading(true);
  //   const fetch = async () => {
  //     const result = await roleApi.permission();
  //     setData(result.data);
  //     setLoading(false);
  //   };
  //   fetch();
  // }, []);

  useEffect(() => {
    const arr: number[] = [];
    data?.forEach((element) => {
      const permission: number = 1 << element.Value;
      if (arr.indexOf(permission) === -1) {
        if (CheckPermission(role.Permission, element.Value))
          arr.push(permission);
        if (
          element.AllowDeleteKey !== null &&
          CheckPermission(role.Permission, element.AllowDeleteKey)
        )
          arr.push(1 << element.AllowDeleteKey);
      }
    });
    setPermissions([...arr]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, role.Permission]);

  const onCheckboxChange = (checked: boolean, val: number) => {
    const permission: number = 1 << val;
    if (checked) {
      permissions.push(permission);
    } else {
      const index = permissions.findIndex((x) => x === permission);
      permissions.splice(index, 1);
    }
    form.setFieldValue(
      "Permission",
      permissions.reduce((a, b) => a | b, 0)
    );

    setPermissions([...permissions]);
  };

  const cols: ColumnsType<ISysPermission> = [
    {
      title: "Tên chức năng",
      dataIndex: "Name",
    },

    {
      title: "Cấp quyền",
      dataIndex: "Value",
      align: "center",
      render: (val) => (
        <Checkbox
          onChange={(e) => onCheckboxChange(e.target.checked, val)}
          checked={permissions.indexOf(1 << val) > -1}
        />
      ),
    },
  ];

  return <TableNoPaging data={data ?? []} cols={cols} loading={isLoading} />;
};

export default PermissionConfigs;
