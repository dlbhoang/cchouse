import { Modal } from "antd";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, type ReactNode } from "react";
import ReactPlayer from "react-player";

import RenderPhone from "@/lib/components/shared/CustomRender/RenderPhone";
import HistoryTree from "@/lib/components/shared/HistoryTree";
import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import { ETableName } from "@/lib/core/enum";
import { FormatDate } from "@/lib/core/utils/myFormat";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import imagesApi from "@/services/api/imagesApi";
import { fileServices } from "@/services/api/services/fileServices";

type DetailTab = "overview" | "media" | "phone" | "history";

type Prop = {
  data: IPropResponse;
  onClose: () => void;
};

const display = (value: unknown) => {
  if (value === null || value === undefined || value === "" || value === false) return "";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return String(value);
};

const hasValue = (value: unknown): boolean => {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return value > 0;
  if (Array.isArray(value)) return value.some((item) => hasValue(item));
  return true;
};

const DetailField = ({ label, value }: { label: string; value: unknown }) => (
  <div className="admin-map-detail-field">
    <span>{label}</span>
    <strong>{hasValue(value) ? display(value) : "—"}</strong>
  </div>
);

type DetailFieldData = { label: string; value: unknown };

const DetailSection = ({
  title,
  fields = [],
  children,
}: {
  title: string;
  fields?: DetailFieldData[];
  children?: ReactNode;
}) => {
  return (
    <section className="admin-map-detail-section">
      <h3>{title}</h3>
      <div className="admin-map-detail-grid">
        {fields.map((field) => (
          <DetailField key={field.label} {...field} />
        ))}
        {children}
      </div>
    </section>
  );
};

const PropMapDetail = ({ data, onClose }: Prop) => {
  const { data: session } = useSession();
  const [images, setImages] = useState<IMyUploadFile[]>([]);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const propAddress = data.PropAddress;
  const canViewPhone =
    [1, 2].includes(session?.user.RoleId ?? 0) ||
    session?.user.Id === data.UserAdminId ||
    !data.IsHidePhone;

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      const result = await imagesApi.get({
        ContentId: Number(data.Id),
        TableName: ETableName.Property,
      });
      if (!active) return;
      const propertyImages = fileServices.mapFromFileUpload(result.data ?? []);
      const inlineImages = (data.Images ?? []).flatMap((image, index) => {
        if (typeof image === "string") {
          return fileServices.mapFromString(image) ?? [];
        }

        const file = image as typeof image & {
          Path?: string;
          FileName?: string;
          Id?: number;
          BlobName?: string;
          CreatedBy?: string;
          CreatedDate?: string;
        };
        const url = file.url || file.Path;
        if (!url) return [];
        return [{
          ...file,
          uid: file.uid || file.Id?.toString() || `${data.Id}-${index}`,
          name: file.name || file.FileName || "Hình ảnh",
          url,
          blobName: file.BlobName,
          createdBy: file.CreatedBy,
          createdDate: file.CreatedDate,
          type: file.type || "image/png",
        }];
      });
      const mainImage = data.MainImage?.Path
        ? fileServices.mapFromFileUpload([data.MainImage])
        : [];
      setImages(
        propertyImages.length
          ? propertyImages
          : inlineImages.length
            ? inlineImages
            : mainImage
      );
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [data.Id]);

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Tổng quan" },
    { id: "media", label: "Hình ảnh / video" },
    { id: "phone", label: "Điện thoại" },
    { id: "history", label: "Lịch sử" },
  ];

  return (
    <Modal
      open
      onCancel={onClose}
      footer={null}
      title={null}
      width={960}
      centered
      className="admin-map-detail-modal"
      rootClassName="admin-map-detail-root"
      closeIcon={<X size={20} />}
      destroyOnClose
    >
      <div className="admin-map-detail-dialog">
        <header className="admin-map-detail-header">
          <h2>CHI TIẾT BẤT ĐỘNG SẢN</h2>
        </header>

        <div className="admin-map-detail-toolbar">
          <nav className="admin-map-detail-tabs" aria-label="Chi tiết bất động sản">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? "is-active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="admin-map-detail-audit">
            <span>Người nhập: <strong>{display(data.UserAdminName || data.CreatedBy)}</strong></span>
            <span>Ngày nhập: <strong>{FormatDate(data.CreatedDate)}</strong></span>
          </div>
        </div>

        <div className="admin-map-detail-summary">
          <div><span>Mã BĐS:</span><strong>{data.Id}</strong></div>
          <div><span>Địa chỉ:</span><strong>{display(propAddress.DisplayAddress)}</strong></div>
        </div>

        <div className="admin-map-detail-scroll">
          {activeTab === "overview" && (
            <div className="admin-map-detail-overview">
              <DetailSection
                title="Thông tin chính"
                fields={[
                  { label: "Trạng thái", value: data.StatusName },
                  { label: "Loại BĐS", value: propAddress.PropTypeName },
                  { label: "Tình trạng nhà", value: propAddress.StatusUsageName },
                  { label: data.TransType === 2 ? "Giá thuê" : "Giá bán", value: data.DisplayPrice },
                  { label: "Diện tích", value: data.Area ? `${data.Area}m²` : undefined },
                  { label: "Vị trí", value: propAddress.LocationName },
                  { label: "Tên bất động sản", value: propAddress.PropName },
                ]}
              />

              <DetailSection
                title="Vị trí & Pháp lý"
                fields={[
                  { label: "Đặc điểm", value: propAddress.LocationFeatureName },
                  { label: "Độ rộng đường", value: propAddress.StreetWidth ? `${propAddress.StreetWidth}m` : undefined },
                  { label: "Cách mặt tiền", value: propAddress.DistanceToFont ? `${propAddress.DistanceToFont}m` : undefined },
                  { label: "Vị trí đường", value: propAddress.IsOneWay ? "1 chiều" : "2 chiều" },
                  { label: "Hướng", value: propAddress.DirectionName },
                  { label: "Số lần rẽ", value: propAddress.AlleyTurns },
                  { label: "Lân cận", value: propAddress.AlleyValues },
                  { label: "Loại đất", value: propAddress.UsageLaw },
                  { label: "Pháp lý nhà, đất", value: propAddress.DisplayLaws },
                ]}
              />

              <DetailSection
                title="Diện tích & Hiện trạng"
                fields={[
                  { label: "Chiều rộng", value: data.Width ? `${data.Width}m` : undefined },
                  { label: "Chiều dài", value: data.Length ? `${data.Length}m` : undefined },
                  { label: "Mặt hậu", value: data.BackSide ? `${data.BackSide}m` : undefined },
                  { label: "Hiện trạng", value: data.CustomDisplayStructures || data.DisplayStructures },
                  { label: "Tổng DTCN", value: propAddress.AreaLegal ? `${propAddress.AreaLegal}m²` : undefined },
                  { label: "Tổng DT sàn", value: data.FloorArea ? `${data.FloorArea}m²` : undefined },
                ]}
              />

              <DetailSection
                title="Trang bị & Tiện ích"
                fields={[
                  { label: "Số phòng", value: data.Bedroom },
                  { label: "Số toilet", value: data.Bathroom },
                  { label: "Nội thất", value: data.Furniture },
                  { label: "Trang thiết bị", value: data.DisplayEquipments },
                  { label: "Tiện ích", value: data.DisplayUtilities },
                  { label: "Giá thuê", value: propAddress.DisplayPriceForRent },
                  { label: "Thời gian thuê", value: propAddress.EndTimeRent },
                ]}
              />

              <DetailSection
                title="Ghi chú nội bộ"
                fields={[{ label: "Nội dung", value: data.Note }]}
              />
            </div>
          )}

          {activeTab === "media" && (
            <div className="admin-map-detail-media">
              <DetailSection title="Hình ảnh / tài liệu">
                <div className="admin-map-detail-media-content">
                  <ImagesPreview images={images} imgWidth={120} />
                </div>
              </DetailSection>
              <DetailSection title="Video">
                {data.Video ? <ReactPlayer width="100%" url={data.Video} controls /> : <p>Chưa có video</p>}
              </DetailSection>
            </div>
          )}

          {activeTab === "phone" && (
            <DetailSection title="Thông tin liên hệ">
              <div className="admin-map-detail-phone">
                {canViewPhone ? (
                  <RenderPhone phones={data.CustomerPhone?.toString().split(",") ?? []} />
                ) : (
                  <span>SĐT đang bị ẩn, vui lòng liên hệ quản lý</span>
                )}
              </div>
            </DetailSection>
          )}

          {activeTab === "history" && (
            <DetailSection title="Lịch sử thay đổi">
              <div className="admin-map-detail-history">
                <HistoryTree instanceId={data.Id} TableName="tblProp" />
              </div>
            </DetailSection>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PropMapDetail;
