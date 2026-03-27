import { Button, Tabs, TabsProps } from "antd";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ICountItem } from "@/lib/interfaces/base/ICountStatus";
import { useAdminContext } from "@/lib/stored";

type Props = {
  defaultActiveKey?: string;
  counts: ICountItem[];
  onChange: (key: string) => void;
};
const FeedStatusTabs = ({ counts, onChange, ...props }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { enumList } = useAdminContext();

  const items: TabsProps["items"] = enumList.StatusBase.map((e) => ({
    key: e.Value.toString(),
    label: `${e.Name} (${counts.find((x) => x.Id === e.Value)?.Count ?? 0})`,
  }));

  return (
    <Tabs
      {...props}
      items={items}
      onChange={onChange}
      tabBarExtraContent={
        [1, 2].includes(session?.user.RoleId ?? 0)
          ? {
              right: (
                <Button onClick={() => router.push(AppRoutes.feedPricing.url)}>
                  Biểu phí
                </Button>
              ),
            }
          : undefined
      }
    />
  );
};

export default FeedStatusTabs;
