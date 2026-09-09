import { Button, Tabs, TabsProps } from "antd";
import { Building2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { useAdminContext } from "@/lib/stored";

type Props = {
  counts: ICountItem[];
  onChange: (key: string) => void;
  activeKey?: string;
};
const UserStatusTabs = ({ counts, onChange, activeKey = "3" }: Props) => {
  const router = useRouter();
  const { enumList } = useAdminContext();
  const data = enumList.UserStatus.some((item) => item.Value === 4)
    ? enumList.UserStatus
    : [...enumList.UserStatus, { Value: 4, Name: "Từ chối" }];

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
      activeKey={activeKey}
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
