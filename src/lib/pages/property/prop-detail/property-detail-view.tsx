"use client";

import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { ETableName } from "@/lib/core/enum";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import imagesApi from "@/services/api/imagesApi";
import { fileServices } from "@/services/api/services/fileServices";
import ContactSection from "./components/contact-section";
import MediaGallery from "./components/media-gallery";
import PropertyMap from "./components/property-map";
import WarehouseSection from "./components/warehouse-section";
import { DetailSection } from "./components/detail-field";
import OverviewTab from "./tabs/overview-tab";

type Props = {
  data: IPropResponse;
};

const PropertyDetailView = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [images, setImages] = useState<IMyUploadFile[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const result = await imagesApi.get({
        ContentId: data.Id,
        TableName: ETableName.Property,
      });
      setImages(fileServices.mapFromFileUpload(result.data));
    };

    fetchImages();
  }, [data.Id]);

  const tabItems = [
    {
      key: "overview",
      label: "Tổng quan",
      children: (
        <OverviewTab data={data} images={images} showAllSections />
      ),
    },
    {
      key: "media",
      label: "Hình ảnh / video",
      children: (
        <DetailSection title="Hình ảnh & Video">
          <MediaGallery images={images} videoUrl={data.Video} />
        </DetailSection>
      ),
    },
    {
      key: "phone",
      label: "Điện thoại",
      children: (
        <>
          <DetailSection title="Liên hệ">
            <ContactSection data={data} />
          </DetailSection>
          <WarehouseSection data={data} />
        </>
      ),
    },
    {
      key: "map",
      label: "Bản đồ",
      children: <PropertyMap data={data} height={520} />,
    },
  ];

  return (
    <div className="property-detail">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="property-detail-tabs"
      />
    </div>
  );
};

export default PropertyDetailView;
