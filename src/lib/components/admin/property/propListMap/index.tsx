import { Button, Card, List, Tag, Typography } from "antd";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { objToQueryString } from "@/lib/core/utils/app-func";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";

const { Text } = Typography;

const PropItem = ({
  item,
  href,
  selected = false,
}: {
  item: IPropResponse;
  href: string;
  selected?: boolean;
}) => {
  return (
    <List.Item
      key={item.Id}
      className={selected ? "is-selected" : undefined}
      aria-current={selected ? "location" : undefined}
    >
      <div className="map-property-item">
        <div className="map-property-item-heading">
          <Tag className="map-property-item-id">Mã: {item.Id}</Tag>
          <Link href={href} className="map-property-item-address">
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
  const searchParams = useSearchParams();
  const { data, error, isValidating, mutate } = propertyApi.useGetMapResults(opts);

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({
        ...opts,
        pageIndex,
        pageSize,
      })}`
    );
  };

  return (
    <Card
      className="map-property-list-card"
      bodyStyle={{ padding: 0, height: "100%" }}
    >
      <List
        locale={{
          emptyText: error ? (
            <div className="map-property-list-error" role="status">
              <span>Không tải được dữ liệu bản đồ.</span>
              <Button type="link" onClick={() => mutate()}>
                Thử lại
              </Button>
            </div>
          ) : (
            <div className="map-property-list-empty" role="status">
              <span>Không tìm thấy bất động sản phù hợp.</span>
            </div>
          ),
        }}
        header={
          <div className="map-property-list-heading">
            <Text>
              Hiển thị {(data?.totalRow ?? 0).toLocaleString("vi-VN")} kết quả
            </Text>
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
        loading={isValidating && !error}
        dataSource={Array.isArray(data?.data) ? data.data : []}
        renderItem={(item) => {
          const detailParams = new URLSearchParams(searchParams?.toString() ?? "");
          detailParams.set("PropertyId", item.Id.toString());
          return (
            <PropItem
              item={item}
              href={`?${detailParams.toString()}`}
              selected={searchParams?.get("PropertyId") === item.Id.toString()}
            />
          );
        }}
      />
    </Card>
  );
};
