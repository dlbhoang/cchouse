import { Tabs, TabsProps } from "antd";

import { IRoleResponse } from "@/lib/interfaces/IRole";

type Props = {
  data: IRoleResponse[];
  onChange: (val: IRoleResponse | undefined) => void;
};
const RoleTabs = ({ data, onChange }: Props) => {
  const items: TabsProps["items"] = data.map((e) => ({
    key: e.Code,
    label: `${e.Code} - ${e.Name} (${e.NumberOfUsers})`,
  }));
  return (
    <Tabs
      defaultActiveKey={data[0]?.Code}
      items={items}
      onChange={(e) => onChange(data.find((x) => x.Code === e))}
    />
  );
};

export default RoleTabs;
