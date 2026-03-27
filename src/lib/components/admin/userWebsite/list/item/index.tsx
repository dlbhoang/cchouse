import {
  EyeOutlined,
  LockOutlined,
  UnlockFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import type { IUserWebsiteResponse } from "@/services/api/userWebsite/model";
import userWebsiteApi from "@/services/api/userWebsite/userWebsiteApi";
import UserWebsiteStatus from "../../user-status";
import UserWebsiteType from "../../user-type";

const { Meta } = Card;

type Props = {
  data: IUserWebsiteResponse;
};

const UserWebsiteItem = ({ data }: Props) => {
  const router = useRouter();
  return (
    <UserWebsiteType text={data.TypeName}>
      <Card
        actions={[
          <Button
            icon={data.IsActive ? <LockOutlined /> : <UnlockFilled />}
            onClick={async () =>
              data.Id && (await userWebsiteApi.block(data.Id))
            }
          >
            {data.IsActive ? "Tạm khoá" : "Kích hoạt"}
          </Button>,
          <Button
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(`${AppRoutes.userWebsite.url}/${data.Id}`)
            }
          >
            Chi tiết
          </Button>,
        ]}
      >
        <Meta
          avatar={
            <Avatar src={data.Avatar} size={46} icon={<UserOutlined />} />
          }
          title={data.FullName}
          description={
            <Space direction="vertical" size={"small"}>
              <RenderPhone
                phones={data.Phone ? [data.Phone] : undefined}
                showIcon
              />
              {data.Email && (
                <Typography.Text type="secondary">{data.Email}</Typography.Text>
              )}
              <UserWebsiteStatus value={data.StatusName} />
            </Space>
          }
        />
      </Card>
    </UserWebsiteType>
  );
};

export default UserWebsiteItem;
