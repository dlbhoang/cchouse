import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Image, message, Space } from "antd";
import { useState } from "react";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import type { Direction } from "@/lib/types/common";
import imagesApi from "@/services/api/imagesApi";
import CardImageHorizontal from "../card/image/horizontal";
import ImageCard from "../ImageCard";

type Props = {
  images: IMyUploadFile[];
  imgWidth: number;
  isPreviewVisible?: boolean;
  hidden?: boolean;
  mode?: Direction;
  onPreviewVisible?: (visible: boolean) => void;
  onDelete?: (uid: string) => void;
};

const ImagesPreview = ({
  isPreviewVisible,
  onPreviewVisible,
  hidden,
  images,
  mode = "vertical",
  imgWidth,
  onDelete,
}: Props) => {
  const [download, setDownload] = useState(false);

  const onDownloadMultiple = async () => {
    if (download) return;
    const blobNames = images
      .map((e) => e.blobName)
      .filter((x): x is string => x !== undefined);

    if (blobNames.length === 0) {
      message.warning("Không tìm thấy files tải xuống");
      return;
    }

    setDownload(true);
    const hide = message.loading("Đang tạo file tải xuống...", 0); // duration 0 = manual close
    try {
      const response = await imagesApi.download(blobNames);
      // Fallback: set filename manually based on input
      const isSingleFile = blobNames.length === 1;
      const defaultFileName = isSingleFile
        ? blobNames[0].split("/").pop() || "file"
        : "hinh-anh.zip";

      const blob = response as unknown as Blob;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", defaultFileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      hide(); // close loading
      setDownload(false);
      message.success("Tải xuống thành công!");
    } catch (err) {
      setDownload(false);
      hide(); // close loading
    }
  };

  return (
    <Image.PreviewGroup
      preview={{
        visible: isPreviewVisible,
        onVisibleChange: (visible) =>
          onPreviewVisible && onPreviewVisible(visible),
        onChange: (current, prev) =>
          console.log(`current index: ${current}, prev index: ${prev}`),
        toolbarRender: (
          _,
          {
            transform: { scale },
            actions: {
              onFlipY,
              onFlipX,
              onRotateLeft,
              onRotateRight,
              onZoomOut,
              onZoomIn,
            },
          }
        ) => (
          <Space size={12} className="toolbar-wrapper">
            <DownloadOutlined
              onClick={onDownloadMultiple}
              disabled={download}
            />
            <SwapOutlined rotate={90} onClick={onFlipY} />
            <SwapOutlined onClick={onFlipX} />
            <RotateLeftOutlined onClick={onRotateLeft} />
            <RotateRightOutlined onClick={onRotateRight} />
            <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
            <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
          </Space>
        ),
      }}
    >
      <Space wrap align="center" style={{ display: hidden ? "none" : "flex" }}>
        {mode === "vertical"
          ? images.map((e) => (
              <ImageCard
                key={e.uid}
                model={e}
                preview
                onDelete={onDelete}
                onClick={() => {}}
              />
            ))
          : images.map((e) => (
              <CardImageHorizontal
                key={e.uid}
                image={e}
                onDelete={onDelete}
                preview
                onClick={() => {}}
              />
            ))}
      </Space>
    </Image.PreviewGroup>
  );
};

export default ImagesPreview;
