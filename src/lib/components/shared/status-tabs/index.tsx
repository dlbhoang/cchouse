import { Tabs, TabsProps } from "antd";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";

type Props = {
  counts: ICountItem[];
  onChange: (key: string) => void;
};
const StatusTabs = ({ counts, onChange }: Props) => {
  const items: TabsProps["items"] = counts.map((e) => ({
    key: e.Id.toString(),
    label: `${e.Name} (${e?.Count ?? 0})`,
  }));

  return (
    <Tabs
      defaultActiveKey={counts[0]?.Id.toString()}
      items={items}
      onChange={onChange}
    />
  );
};

export default StatusTabs;
