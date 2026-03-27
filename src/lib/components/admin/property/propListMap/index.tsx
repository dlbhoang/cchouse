import { Card, List, Segmented, Space, Tag, Typography } from "antd";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import { appConst } from "@/lib/core/configs/appConst";
import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";

const { Text } = Typography;

const PropItem = ({ item }: { item: IPropResponse }) => {
  return (
    <List.Item
      key={item.Id}
      actions={[
        <Text strong>Giá: {item.DisplayPrice}</Text>,
        <Text>
          <RenderArea
            title="DTTT: "
            area={item.Area}
            length={item.Length}
            width={item.Width}
          />
        </Text>,
        <Link href={`?PropertyId=${item.Id}`}>Chi tiết</Link>,
      ]}
    >
      <List.Item.Meta
        title={
          <Space>
            <Tag
              style={{
                color: "#ffffff",
                backgroundColor: appConst.PROP_STATUS_COLORS[item.Status - 1],
              }}
            >
              {`Mã: ${item?.Id}`}
            </Tag>
            <Link href={`?PropertyId=${item.Id}`}>
              {CombineAddress({ ...item.PropAddress })}
            </Link>
          </Space>
        }
        description={<Text>Loại: {item.PropAddress.PropTypeName}</Text>}
      />
      <Text>Kết cấu: {item.CustomDisplayStructures}</Text>
    </List.Item>
  );
};
type Props = {
  opts: IPropAdminOpts;
};
export const PropListMap = ({ opts }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, isValidating, mutate } = propertyApi.useGet(opts);

  useEffect(() => {
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({
        ...opts,
        pageIndex,
        pageSize,
      })}`
    );
  };

  const handleTransTypeChange = (val: ETransType) => {
    router.push(
      `${pathname}?${objToQueryString({
        ...opts,
        TransType: val,
      })}`
    );
  };

  return (
    <Card
      style={{
        height: "85vh",
        overflow: "auto",
        minWidth: 400,
        maxWidth: 450,
      }}
      bodyStyle={{ paddingBlock: 0 }}
    >
      <List
        header={
          <Space.Compact direction="vertical" block>
            <Segmented
              options={[
                { value: ETransType.sell, label: "Mua bán" },
                { value: ETransType.rent, label: "Cho thuê" },
              ]}
              block
              defaultValue={opts.TransType ?? ETransType.sell}
              onChange={(val) => handleTransTypeChange(val as ETransType)}
            />
            <Text>Tìm được {data?.totalRow ?? 0} kết quả</Text>
          </Space.Compact>
        }
        itemLayout="vertical"
        pagination={{
          onChange: (page) => {
            handlePageIndexChange(page, 20);
          },
          pageSize: 20,
          total: data?.totalRow ?? 0,
          showSizeChanger: false,
        }}
        loading={isValidating}
        dataSource={data?.data}
        renderItem={(item) => <PropItem item={item} />}
      />
    </Card>
  );
};
