import { Descriptions, DescriptionsProps } from "antd";
import { useEffect, useState } from "react";
import { useAdminContext } from "@/lib/stored";
import apartmentApi from "@/services/api/apartment/apartmentApi";
import { IApartmentResponse } from "@/services/api/apartment/IApartment";

const ApartmentDescription = ({ id }: { id: number }) => {
  const [data, setData] = useState<IApartmentResponse>();
  const { smallScreen } = useAdminContext();
  useEffect(() => {
    const fetch = async () => {
      const res = await apartmentApi.getById(id);
      setData(res.data);
    };
    fetch();
  }, [id]);
  const items: DescriptionsProps["items"] = data
    ? [
        {
          key: "1",
          label: "Địa chỉ",
          span: 3,
          children: data.DisplayAddress,
        },
        {
          key: "2",
          label: "Loại hình",
          span: 2,
          children: data.DisplayTypes?.join(", "),
        },
        {
          key: "4",
          label: "Pháp lý",
          children: data.LawName,
        },
        {
          key: "3",
          label: "Tổng diện tích",
          children: (
            <span>
              {data.Area} m<sup>2</sup>
            </span>
          ),
        },
        // {
        //   key: '5',
        //   label: 'Tiện ích',
        //   children:
        //     data.DisplayUtilities.length === 0
        //       ? 'Chưa cập nhật'
        //       : data.DisplayUtilities,
        // },
      ]
    : [];

  return (
    <Descriptions
      title="Thông tin chung cư"
      bordered
      size="small"
      layout={smallScreen ? "horizontal" : "vertical"}
      items={items}
    />
  );
};

export default ApartmentDescription;
