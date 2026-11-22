import { Alert, Button, Empty, Image, Spin } from "antd";
import { FileText, Minus, Play, Plus } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import useSWR from "swr";

import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import { ETableName } from "@/lib/core/enum";
import { FormatDate } from "@/lib/core/utils/myFormat";
import imagesApi from "@/services/api/imagesApi";
import { HistoryEntry } from "../../HistoryTree/entry";
import historyStyles from "../../HistoryTree/history.module.css";
import { openVideoModal } from "../Video";
import { groupMediaEvents } from "./events";
import styles from "./media-history.module.css";

type Props = {
  isOpen: boolean;
  contentId: number;
  TableName: ETableName;
  onClose: () => void;
  video?: boolean;
  recordLabel?: string;
  createdBy?: string;
  createdDate?: string;
};

function VideoThumbnail({ path, name }: { path: string; name: string }) {
  const isMobile = useMediaQuery({ query: "(max-width: 760px)" });
  const [duration, setDuration] = useState<number>();
  const [failed, setFailed] = useState(false);
  const totalSeconds = duration === undefined ? undefined : Math.floor(duration);

  return (
    <button
      type="button"
      className={styles.thumbnail}
      aria-label={`Phát video ${name}`}
      onClick={() => openVideoModal(isMobile, path)}
    >
      {!failed && (
        <video
          src={path}
          preload="metadata"
          muted
          aria-hidden
          onError={() => setFailed(true)}
          onLoadedMetadata={({ currentTarget }) => {
            if (Number.isFinite(currentTarget.duration)) setDuration(currentTarget.duration);
          }}
        />
      )}
      <span className={styles.duration}>
        {totalSeconds === undefined
          ? <Play size={14} />
          : `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`}
      </span>
    </button>
  );
}

export const DeletedImgModal = ({
  onClose,
  isOpen,
  contentId,
  TableName,
  video = false,
  recordLabel,
  createdBy,
  createdDate,
}: Props) => {
  const label = video ? "video" : "ảnh";
  const { data, error, isLoading, mutate } = useSWR(
    isOpen ? ["media-history", TableName, contentId, video] as const : null,
    async ([, table, id, isVideo]) => {
      const params = { ContentId: id, TableName: table, IsVideo: isVideo };
      const [active, deleted] = await Promise.all([
        imagesApi.get(params),
        imagesApi.get({ ...params, IsDeleted: true }),
      ]);
      const files = new Map((active.data ?? []).map((file) => [file.Id, file]));
      for (const file of deleted.data ?? []) {
        files.set(file.Id, { ...file, IsDeleted: true });
      }
      return groupMediaEvents([...files.values()]);
    },
  );

  return (
    <LucideModal
      className={`${historyStyles.dialog} ${styles.dialog}`}
      onCancel={onClose}
      open={isOpen}
      title={
        <>
          {video ? "LỊCH SỬ VIDEO" : "LỊCH SỬ HÌNH ẢNH"}
          <div className={historyStyles.subtitle}>{recordLabel || `Mã: ${contentId}`}</div>
          {(createdBy || createdDate) && (
            <div className={historyStyles.metadata}>
              <div><span>Ngày nhập:</span>{FormatDate(createdDate).replaceAll("-", "/") || "—"}</div>
              <div><span>Người nhập:</span>{createdBy || "—"}</div>
            </div>
          )}
        </>
      }
      footer={null}
      width={1152}
      style={{ top: 48 }}
      styles={{ mask: { background: "rgba(0,0,0,0.3)" } }}
    >
      {error ? (
        <Alert
          type="error"
          showIcon
          message="Không tải được lịch sử"
          action={<Button onClick={() => void mutate()}>Thử lại</Button>}
        />
      ) : isLoading ? (
        <Spin tip="Đang tải lịch sử…"><div style={{ minHeight: 80 }} /></Spin>
      ) : data?.length ? (
        <Image.PreviewGroup>
          <ol className={historyStyles.entries}>
            {data.map((event) => (
              <HistoryEntry className={styles.entry} key={JSON.stringify([event.time, event.actor])} timestamp={event.timestamp} actor={event.actor}>
                {([["added", "Thêm", Plus], ["removed", "Xoá", Minus]] as const).map(([type, action, Icon]) =>
                  event[type].length > 0 && (
                    <section className={styles[type]} key={type}>
                      <h3><Icon size={20} />{action} {label} ({event[type].length})</h3>
                      <div className={styles.media}>
                        {event[type].map((file) => (
                          <div className={styles.tile} key={file.Id}>
                            {video ? (
                              <VideoThumbnail path={file.Path} name={file.FileName} />
                            ) : /\.(jpe?g|png|gif|webp|svg|ico|bmp|avif)$/i.test(file.FileName) ? (
                              <div className={styles.thumbnail}>
                                <Image src={file.Path} alt={file.FileName} />
                              </div>
                            ) : (
                              <a className={styles.thumbnail} href={file.Path} target="_blank" rel="noreferrer" aria-label={file.FileName}>
                                <FileText size={32} />
                              </a>
                            )}
                            <div className={styles.caption}>
                              {file.CreatedBy || "—"}
                              {type === "removed" && file.CreatedDate && <small>{FormatDate(file.CreatedDate).replaceAll("-", "/")}</small>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ),
                )}
              </HistoryEntry>
            ))}
          </ol>
        </Image.PreviewGroup>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`Chưa có lịch sử ${label}`} />
      )}
    </LucideModal>
  );
};
