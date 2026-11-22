"use client";

import { Tag } from "antd";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { hasMapCoordinates } from "@/lib/core/utils/map-coordinates";
import { formatPropertyAddress } from "../detail-utils";

type Props = {
  data: IPropResponse;
  height?: number;
};

const PropertyMap = ({ data, height = 420 }: Props) => {
  const placeId = data.PropAddress.PlaceId;
  const { Lat, Lng } = data.PropAddress;
  const hasCoordinates = hasMapCoordinates(data.PropAddress);

  if (!placeId && !hasCoordinates) {
    return (
      <span className="pd-empty-text block py-10 text-center">
        Chưa có vị trí bản đồ
      </span>
    );
  }

  // shortcut: OSM tiles differ from the design basemap; switch when a matching map source is configured.
  return (
    <div className="pd-map-frame relative">
      <iframe
        title={`map-${data.Id}`}
        height={height}
        width="100%"
        src={placeId
          ? `https://maps.goong.io/?pid=${placeId}`
          : `https://www.openstreetmap.org/export/embed.html?bbox=${Lng! - 0.015}%2C${Lat! - 0.015}%2C${Lng! + 0.015}%2C${Lat! + 0.015}&layer=mapnik&marker=${Lat}%2C${Lng}`}
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
