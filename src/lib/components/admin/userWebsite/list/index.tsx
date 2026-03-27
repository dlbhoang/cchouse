import { Card, Col, Empty, Row, Spin } from "antd";
import AppPagination from "@/lib/components/shared/pagination";
import type { IUserWebsiteOpts } from "@/services/api/userWebsite/model";
import userWebsiteApi from "@/services/api/userWebsite/userWebsiteApi";
import UserWebsiteTable from "../table";
import UserWebsiteItem from "./item";

type Props = {
  opts: IUserWebsiteOpts;
  mode: "list" | "card";
};

const UserWebsiteList = ({ opts, mode }: Props) => {
  const { data, isLoading } = userWebsiteApi.useGet(opts);

  if (mode === "list")
    return (
      <Card size="small">
        <Row gutter={[12, 12]}>
          <Col span={24}>
            Tìm được <b>{data?.totalRow || 0}</b> kết quả
          </Col>
          <Col span={24}>
            <UserWebsiteTable
              data={data?.data || []}
              total={data?.totalRow || 0}
              loading={isLoading}
              searchOptions={opts}
            />
          </Col>
        </Row>
      </Card>
    );

  if (isLoading) return <Spin />;

  return (
    data && (
      <Row gutter={[12, 12]}>
        <Col span={24}>
          Tìm được <b>{data.totalRow}</b> kết quả
        </Col>
        {data.totalRow === 0 ? (
          <Col span={24}>
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 60 }}
              description={<span>Không tìm thấy dữ liệu</span>}
            />
          </Col>
        ) : (
          data.data.map((e) => (
            <Col xs={24} md={12} lg={8} xl={6} key={e.Id}>
              <UserWebsiteItem data={e} />
            </Col>
          ))
        )}
        <Col span={24} style={{ textAlign: "center" }}>
          <AppPagination total={data.totalRow || 0} />
        </Col>
      </Row>
    )
  );
};

export default UserWebsiteList;
