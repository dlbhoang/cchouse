import { Button, Tabs, TabsProps } from "antd";
import { Building2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { useAdminContext } from "@/lib/stored";

type Props = {
  counts: ICountItem[];
  onChange: (key: string) => void;
};
const UserStatusTabs = ({ counts, onChange }: Props) => {
  const router = useRouter();
  const { enumList } = useAdminContext();
  const data = enumList.UserStatus;

  let items: TabsProps["items"] = data.map((e) => ({
    key: e.Value.toString(),
    label: `${e.Name} (${counts.find((x) => x.Id === e.Value)?.Count ?? 0})`,
  }));
  if (items?.length > 1) {
    const [first, second, ...rest] = items;
    items = [second, first, ...rest];
  }
  return (
    <Tabs
      defaultActiveKey={items[0]?.key}
      items={items}
      onChange={onChange}
      tabBarExtraContent={{
        right: (
          <Button
            onClick={() => {
              router.push(AppRoutes.branch.url);
            }}
            icon={<Building2Icon className="size-4" />}
          >
            Chi nhánh
          </Button>
        ),
      }}
    />
  );
};

export default UserStatusTabs;
