import { Tabs, TabsProps } from "antd";
import { useAdminContext } from "@/lib/stored";

type Props = {
  onChange: (key: string) => void;
};
const FeedStatusTabs = ({ onChange }: Props) => {
  const { enumList } = useAdminContext();
  const data = enumList.StatusBase;

  const items: TabsProps["items"] = data.map((e) => ({
    key: e.Value.toString(),
    label: e.Name,
  }));

  return (
    <Tabs defaultActiveKey={items[0]?.key} items={items} onChange={onChange} />
  );
};

export default FeedStatusTabs;
