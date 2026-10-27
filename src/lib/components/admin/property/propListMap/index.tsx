import { Button, Card, List, Tag, Typography } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { objToQueryString } from "@/lib/core/utils/app-func";
import { CombineAddress } from "@/lib/core/utils/myFormat";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";

const { Text } = Typography;

const PropItem = ({
  item,
  onSelect,
  onOpenDetail,
  selected = false,
}: {
  item: IPropResponse;
  onSelect: () => void;
  onOpenDetail: () => void;
  selected?: boolean;
}) => {
  return (
    <List.Item
      key={item.Id}
      className={selected ? "is-selected" : undefined}
      aria-current={selected ? "location" : undefined}
    >
      <button
        type="button"
        className="map-property-item"
        onClick={onSelect}
        onDoubleClick={onOpenDetail}
        aria-pressed={selected}
        title="Bấm một lần để đến vị trí; bấm đúp để xem chi tiết"
        aria-label={`Bất động sản ${item.Id}: ${CombineAddress(item.PropAddress)}. Bấm một lần để xem vị trí, bấm đúp để xem chi tiết.`}
      >
        <div className="map-property-item-heading">
          <Tag className="map-property-item-id">Mã: {item.Id}</Tag>
          <span className="map-property-item-address">
            {CombineAddress({ ...item.PropAddress })}
          </span>
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
            {item.Length && item.Width
              ? ` (${item.Width}×${item.Length}m)`
              : ""}
          </span>
          <span className="map-property-item-price">
            <span>Giá:</span> <strong>{item.DisplayPrice || "—"}</strong>
            {item.PricePerSquareMeter && (
              <small>{item.PricePerSquareMeter}</small>
            )}
          </span>
        </div>
      </button>
    </List.Item>
  );
};
type Props = {
  opts: IPropAdminOpts;
  selectedId?: number;
  onSelect: (item: IPropResponse) => void;
  onOpenDetail: (item: IPropResponse) => void;
  mockData?: IPropResponse[];
};
export const PropListMap = ({
  opts,
  selectedId,
  onSelect,
  onOpenDetail,
  mockData,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, error, isValidating, mutate } = propertyApi.useGetMapResults({
    ...opts,
    pageIndex: Number(opts.pageIndex) || 1,
    pageSize: 20,
  }, !mockData);
  const results = mockData ?? (Array.isArray(data?.data) ? data.data : []);
  const totalRows = mockData?.length ?? data?.totalRow ?? 0;

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({
        ...opts,
        pageIndex,
        pageSize,
      })}`,
    );
  };

  return (
    <Card
      className="map-property-list-card"
      styles={{ body: { padding: 0, height: "100%" } }}
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
              Hiển thị {totalRows.toLocaleString("vi-VN")} kết quả
            </Text>
          </div>
        }
        itemLayout="vertical"
        pagination={{
          current: Number(opts.pageIndex) || 1,
          onChange: (page) => {
            handlePageIndexChange(page, 20);
          },
          pageSize: 20,
          total: totalRows,
          showSizeChanger: false,
        }}
        loading={!mockData && isValidating && !error}
        dataSource={results}
        renderItem={(item) => {
          return (
            <PropItem
              item={item}
              onSelect={() => onSelect(item)}
              onOpenDetail={() => onOpenDetail(item)}
              selected={
                selectedId === item.Id ||
                searchParams?.get("PropertyId") === item.Id.toString()
              }
            />
          );
        }}
      />
    </Card>
  );
};
