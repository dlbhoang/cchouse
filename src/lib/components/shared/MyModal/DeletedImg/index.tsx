import { Modal } from "antd";
import { useEffect, useState } from "react";

import { ETableName } from "@/lib/core/enum";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import apartmentUnitApi from "@/services/api/apartment/unit/apartmentUnitApi";
import imagesApi from "@/services/api/imagesApi";
import ImagesPreview from "../../ImagesPreview";

type Props = {
  isOpen: boolean;
  contentId: number;
  TableName: ETableName;
  onClose: () => void;
};

export const DeletedImgModal = ({
  onClose,
  isOpen,
  contentId,
  TableName: tableName,
}: Props) => {
  const [images, setImages] = useState<IMyUploadFile[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await imagesApi.get({
        ContentId: contentId,
        TableName: tableName,
        IsDeleted: true,
      });
      if (result.data) {
        setImages(
          result.data.map((item) => ({
            uid: item.Id.toString(),
            name: item.FileName,
            url: item.Path,
            // lastModifiedDate: item.CreatedDate,
            // lastModified: item.CreatedBy,
            createdBy: item.CreatedBy,
            createdDate: item.CreatedDate,
            updatedBy: item.UpdatedBy,
            updatedDate: item.UpdatedDate,
            type: "image/png",
          }))
        );
      }
    };

    const fetchApartmentUnitImages = async () => {
      const result = await apartmentUnitApi.images(contentId, {
        IsDeleted: true,
      });
      if (result.data) {
        setImages(
          result.data.map((item) => ({
            uid: item.Id.toString(),
            name: item.FileName,
            url: item.Path,
            createdBy: item.UpdatedBy,
            createdDate: item.UpdatedDate,
            type: "image/png",
          }))
        );
      }
    };

    switch (tableName) {
      case ETableName.ApartmentUnit: {
        fetchApartmentUnitImages();
        break;
      }

      default:
        fetch();
        break;
    }
  }, [contentId, tableName]);
  return (
    <Modal
      maskClosable
      onCancel={onClose}
      open={isOpen}
      title="Lịch sử hình ảnh"
      footer={null}
      width={900}
    >
      <ImagesPreview images={images} imgWidth={30} mode="horizontal" />
    </Modal>
  );
};
