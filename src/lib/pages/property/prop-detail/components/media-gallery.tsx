"use client";

import { PlayCircleOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { useMediaQuery } from "react-responsive";
import { openVideoModal } from "@/lib/components/shared/MyModal/Video";
import { FormatDate } from "@/lib/core/utils/myFormat";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";

type MediaItem = IMyUploadFile & {
  isVideo?: boolean;
};

type Props = {
  images: IMyUploadFile[];
  videoUrl?: string;
};

const MediaCard = ({
  item,
  onVideoClick,
}: {
  item: MediaItem;
  onVideoClick?: (url: string) => void;
}) => {
  const content = item.isVideo ? (
    <div
      className="pd-media-video"
      onClick={() => item.url && onVideoClick?.(item.url)}
    >
      <PlayCircleOutlined style={{ fontSize: 36, color: "rgba(255,255,255,0.9)" }} />
      <div className="pd-media-video-badge">Video</div>
    </div>
  ) : (
    <Image src={item.url} alt={item.name} height={120} preview />
  );

  return (
    <div className="pd-media-card">
      <div className="pd-media-thumb">{content}</div>
      <span className="pd-media-name">{item.createdBy || "--"}</span>
      <span className="pd-media-date">
        {item.createdDate ? FormatDate(item.createdDate) : "--"}
      </span>
    </div>
  );
};

const MediaGallery = ({ images, videoUrl }: Props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 760px)" });

  const mediaItems: MediaItem[] = [
    ...images,
    ...(videoUrl
      ? [
          {
            uid: "video",
            name: "video",
            url: videoUrl,
            isVideo: true,
            type: "video/mp4",
            status: "done" as const,
          },
        ]
      : []),
  ];

  if (mediaItems.length === 0) {
    return <span className="pd-empty-text">Chưa có hình ảnh / video</span>;
  }

  return (
    <div className="flex flex-wrap gap-5">
      {mediaItems.map((item) => (
        <MediaCard
          key={item.uid}
          item={item}
          onVideoClick={(url) => openVideoModal(isMobile, url)}
        />
      ))}
    </div>
  );
};

export default MediaGallery;
