import { useEffect, useState } from "react";

import type { ETableName } from "@/lib/core/enum";
import imagesApi, { type IFileUploadResponse } from "@/services/api/imagesApi";

export const useFetchImages = ({
  contentId,
  tableName,
}: {
  contentId: number;
  TableName: ETableName;
}) => {
  const [images, setImages] = useState<IFileUploadResponse[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await imagesApi.get({
        ContentId: contentId,
        TableName: tableName,
      });
      setImages(response.data);
    };
    fetch();
  }, [contentId, tableName]);
  return images;
};
