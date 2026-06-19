import { Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BadgeConfirm from "@/lib/components/shared/BadgeConfirm";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import TableBase from "@/lib/components/shared/TableBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { IFeedPricingResponse } from "@/services/api/feed/IFeedPricing";
import feedPricingApi from "@/services/api/feedPricingApi";

type Props = {
  data: IFeedPricingResponse[];
  arrDays: number[];
  total: number;
  loading: boolean;
  searchOptions: ISearchOptions;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
  OpenModalUpdate: (item: IFeedPricingResponse) => void;
  handleMutate: () => void;
};

interface IFeedPricingItem {
  key: React.Key;
  name: string;
  totalPrice: number;
  discount: number;
}

const FeedPricingTable = ({
  data,
  arrDays,
  total,
  loading,
  searchOptions,
  onPageIndexChange,
  OpenModalUpdate,
  handleMutate,
}: Props) => {
  const expandedRowRender = (index: number) => {
    const columns: ColumnsType<IFeedPricingItem> = [
      {
        title: "Số ngày ra tin",
        dataIndex: "name",
      },
      {
        title: "Phí ra tin",
        dataIndex: "totalPrice",
        align: "right",
        render: (val) =>
          val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0,
      },
      {
        title: "Chiết khấu (%)",
        dataIndex: "discount",
        align: "right",
        render: (val) => (val ? `${val} %` : 0),
      },
    ];

    const expandedData: IFeedPricingItem[] = [];
    for (let j = 0; j < arrDays.length; j += 1) {
      expandedData.push({
        key: j.toString(),
        name: `${arrDays[j]} ngày`,
        totalPrice: data[index].ArrTotalPrice[j],
        discount: data[index].ArrDiscount[j],
      });
    }

    return (
      <Table columns={columns} dataSource={expandedData} pagination={false} />
    );
  };

  const cols: ColumnsType<IFeedPricingResponse> = [
    {
      title: "STT",
      dataIndex: "Id",
      sorter: true,
    },
    {
      title: "Loại tin",
      dataIndex: "Title",
    },
    {
      title: "Mô tả",
      dataIndex: "Content",
    },
    {
      title: "Người tạo",
      dataIndex: "CreatedBy",
    },
    {
      title: "Tình trạng",
      dataIndex: "IsActive",
      render(value, record) {
        return (
          <BadgeConfirm
            value={value}
            onOkClick={async () => {
              await feedPricingApi.toggleActive(record.Id);
              handleMutate();
            }}
          />
        );
      },
    },
    {
      title: "Tao tác",
      dataIndex: "Id",
      render(value, record) {
        return (
          <Space>
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              onClick={() => OpenModalUpdate(record)}
            >
              <SquarePenIcon />
            </Button>
            <BtnConfirm
              type="icon"
              icon={<Trash2Icon className="size-4" />}
              onOkClick={async () => {
                const result = await feedPricingApi.delete(value);
                NotiBase("success", result.message ?? "Xóa thành công");
                handleMutate();
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <TableBase
      loading={loading}
      total={total}
      searchOptions={searchOptions}
      data={data}
      cols={cols as any}
      // defaultSelectRow={[1]}
      // onSelect={onSelect}
      onPageIndexChange={onPageIndexChange}
      expandedRowRender={expandedRowRender}
    />
  );
};

export default FeedPricingTable;