import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import type { SelectType } from "@/lib/types/common";
import type { IUserAdminPublic } from "@/services/api/userAdmin/IUserAdmin";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";
import SelectBase from "../base/SelectBase";

type Props = {
  valueAsName?: boolean;
  exceptCurrentUser?: boolean;
};

export const UserAdminSelect = ({
  valueAsName = false,
  exceptCurrentUser = false,
  placeholder = "Chọn nhân viên",
  value,
  mode,
  allowClear,
  onChange,
  ...props
}: SelectType & Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IUserAdminPublic[]>([]);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await userAdminApi.getUserAdminPublic(false);
      setData(result.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const options = data.map((e) => ({
    label: `${e.Name}`,
    value: valueAsName ? e.Name : e.Id ?? 0,
    disabled: e.Status === 2,
  }));

  const { data: session } = useSession();
  return (
    <SelectBase
      value={value}
      mode={mode}
      placeholder={placeholder}
      allowClear={allowClear}
      options={
        exceptCurrentUser
          ? options.filter((x) => x.value !== session?.user.Id)
          : options
      }
      onChange={onChange}
      loading={loading}
      {...props}
    />
  );
};
