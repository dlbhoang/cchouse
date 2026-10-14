import { Card, List, Segmented, Tag, Typography } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";

const { Text } = Typography;

const PropItem = ({ item }: { item: IPropResponse }) => {
  return (
    <List.Item key={item.Id}>
      <div className="map-property-item">
        <div className="map-property-item-heading">
          <Tag className="map-property-item-id">Mã: {item.Id}</Tag>
          <Link href={`?PropertyId=${item.Id}`} className="map-property-item-address">
            {CombineAddress({ ...item.PropAddress })}
          </Link>
        </div>
        <div className="map-property-item-line">
          <span>Kết cấu:</span> {item.CustomDisplayStructures || "—"}
        </div>
        <div className="map-property-item-line">
          <span>Loại:</span> {item.PropAddress.PropTypeName || "—"}
        </div>
        <div className="map-property-item-footer">
          <span>
            <span>DTTT:</span> {item.Area?.toLocaleString("vi-VN")}m²
            {item.Length && item.Width ? ` (${item.Width}×${item.Length}m)` : ""}
          </span>
          <span className="map-property-item-price">
            <span>Giá:</span> <strong>{item.DisplayPrice || "—"}</strong>
            {item.PricePerSquareMeter && <small>{item.PricePerSquareMeter}</small>}
          </span>
        </div>
      </div>
    </List.Item>
  );
};
type Props = {
  opts: IPropAdminOpts;
};
export const PropListMap = ({ opts }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isValidating } = propertyApi.useGet(opts);

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
      className="map-property-list-card"
      bodyStyle={{ padding: 0, height: "100%" }}
    >
      <List
        header={
          <div className="map-property-list-heading">
            <Segmented
              options={[
                { value: ETransType.sell, label: "Mua bán" },
                { value: ETransType.rent, label: "Cho thuê" },
              ]}
              block
              value={opts.TransType ?? ETransType.sell}
              onChange={(val) => handleTransTypeChange(val as ETransType)}
            />
            <Text>Hiển thị {data?.totalRow ?? 0} kết quả</Text>
          </div>
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
        dataSource={Array.isArray(data?.data) ? data.data : []}
        renderItem={(item) => <PropItem item={item} />}
      />
    </Card>
  );
};
