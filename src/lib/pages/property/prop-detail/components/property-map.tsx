"use client";

import { Tag } from "antd";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { formatPropertyAddress } from "../detail-utils";

type Props = {
  data: IPropResponse;
  height?: number;
};

const PropertyMap = ({ data, height = 420 }: Props) => {
  const placeId = data.PropAddress.PlaceId;

  if (!placeId) {
    return (
      <span className="pd-empty-text block py-10 text-center">
        Chưa có vị trí bản đồ
      </span>
    );
  }

  return (
    <div className="pd-map-frame relative">
      <iframe
        title={`map-${data.Id}`}
        height={height}
        width="100%"
        src={`https://maps.goong.io/?pid=${placeId}`}
        className="block border-0"
      />
      <div className="pd-map-box">
        <Tag color="blue" className="pd-map-tag">
          Mã: {data.Id}
        </Tag>
        <span className="pd-map-address">{formatPropertyAddress(data)}</span>
      </div>
    </div>
  );
};

export default PropertyMap;
