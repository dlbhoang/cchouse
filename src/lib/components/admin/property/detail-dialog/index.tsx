import { Modal as LucideModal } from "@/lib/components/antd-lucide";
import {Alert as LucideAlert } from "@/lib/components/antd-lucide";
import { Spin, Tooltip } from "antd";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import ReactPlayer from "react-player";

import HistoryTree from "@/lib/components/shared/HistoryTree";
import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import { ETableName } from "@/lib/core/enum";
import { FormatDate } from "@/lib/core/utils/myFormat";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import imagesApi from "@/services/api/imagesApi";
import { fileServices } from "@/services/api/services/fileServices";
import PropertyMap from "@/lib/pages/property/prop-detail/components/property-map";
import ContactSection from "@/lib/pages/property/prop-detail/components/contact-section";
import WarehouseSection from "@/lib/pages/property/prop-detail/components/warehouse-section";
import { getEnumName } from "@/lib/pages/property/prop-detail/detail-utils";
import { useAdminContext } from "@/lib/stored";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import "@/lib/pages/property/prop-detail/property-detail.css";
import "./property-detail-dialog.css";

type DetailTab = "overview" | "media" | "phone" | "map" | "history";

type Prop = {
  open: boolean;
  data?: IPropResponse;
  loading?: boolean;
  error?: boolean;
  onClose: () => void;
  onEdit?: () => void;
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
  <div className="property-detail-dialog-field">
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
    <section className="property-detail-dialog-section">
      <h3>{title}</h3>
      <div className="property-detail-dialog-grid">
        {fields.map((field) => (
          <DetailField key={field.label} {...field} />
        ))}
        {children}
      </div>
    </section>
  );
};

const PropertyDetailDialog = ({
  open,
  data,
  loading = false,
  error = false,
  onClose,
  onEdit,
}: Prop) => {
  const router = useRouter();
  const { enumList } = useAdminContext();
  const [images, setImages] = useState<IMyUploadFile[]>([]);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const propAddress = data?.PropAddress;

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      if (!open || !data) {
        setImages([]);
        return;
      }
      const result = await imagesApi.get({
        ContentId: Number(data.Id),
        TableName: ETableName.Property,
      }).catch(() => ({ data: [] }));
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
  }, [data, open]);

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Tổng quan" },
    { id: "media", label: "Hình ảnh / video" },
    { id: "phone", label: "Điện thoại" },
    { id: "map", label: "Bản đồ" },
    { id: "history", label: "Lịch sử" },
  ];

  return (
    <LucideModal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      width={1324}
      centered={false}
      className="property-detail-dialog-modal"
      rootClassName="property-detail-dialog-root"
      closeIcon={<X size={20} />}
      destroyOnClose
    >
      {loading ? (
        <div className="property-detail-dialog-loading"><Spin size="large" /></div>
      ) : error ? (
        <div className="property-detail-dialog-loading">
          <LucideAlert type="error" showIcon message="Không tải được chi tiết bất động sản." />
        </div>
      ) : data && propAddress ? (
      <div className="property-detail-dialog">
        <header className="property-detail-dialog-header">
          <Tooltip title="Quay lại danh sách"><button type="button" onClick={onClose} aria-label="Quay lại danh sách"><ArrowLeft size={22} /></button></Tooltip>
          <div><h2>Chi tiết bất động sản</h2><span>Mua bán BĐS ／ Chi tiết bất động sản</span></div>
        </header>

        <div className="property-detail-dialog-toolbar">
          <nav className="property-detail-dialog-tabs" aria-label="Chi tiết bất động sản">
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
          <div className="property-detail-dialog-audit">
            <span>Người nhập: <strong>{display(data.UserAdminName || data.CreatedBy)}</strong></span>
            <span>Ngày nhập: <strong>{FormatDate(data.CreatedDate)}</strong></span>
          </div>
        </div>

        {activeTab === "overview" && <div className="property-detail-dialog-summary">
          <div><span>Mã BĐS:</span><strong>{data.Id}</strong></div>
          <div><span>Địa chỉ:</span><strong>{display(propAddress.DisplayAddress)}</strong></div>
        </div>}

        <div className="property-detail-dialog-scroll">
          {activeTab === "overview" && (
            <div className="property-detail-dialog-overview">
              <DetailSection
                title="Tổng quan bất động sản"
                fields={[
                  { label: "Trạng thái", value: data.StatusName },
                  { label: "Loại BĐS", value: propAddress.PropTypeName },
                  { label: "Tên bất động sản", value: propAddress.PropName },
                  { label: "Loại đất", value: getEnumName(enumList.UsageLaw, propAddress.UsageLaw) },
                  { label: "Pháp lý Nhà, đất", value: propAddress.DisplayLaws },
                  { label: "Tình trạng nhà", value: propAddress.StatusUsageName },
                  { label: data.TransType === 2 ? "Giá thuê" : "Giá bán", value: data.DisplayPrice },
                  { label: "Pháp lý Nhà, đất", value: propAddress.DisplayLaws },
                  { label: "Giá thuê", value: propAddress.DisplayPriceForRent },
                  { label: "Thời gian thuê", value: propAddress.EndTimeRent },
                ]}
              />

              <DetailSection
                title="Loại hình & Vị trí"
                fields={[
                  { label: "Vị trí", value: propAddress.LocationName },
                  { label: "Vị trí đường", value: propAddress.IsOneWay ? "1 chiều" : "2 chiều" },
                  { label: "Độ rộng đường", value: propAddress.StreetWidth ? `${propAddress.StreetWidth}m` : undefined },
                  { label: "Đặc điểm", value: propAddress.LocationFeatureName },
                  { label: "Hướng", value: propAddress.DirectionName },
                  { label: "Số lần rẽ", value: propAddress.AlleyTurns },
                  { label: "Lần rẽ 1", value: propAddress.AlleyValues?.[0] },
                  { label: "Lần rẽ 2", value: propAddress.AlleyValues?.[1] },
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
                ]}
              />

              <DetailSection
                title="Ghi chú nội bộ"
                fields={[{ label: "Nội dung", value: data.Note }]}
              />
            </div>
          )}

          {activeTab === "media" && (
            <div className="property-detail-dialog-media">
              <DetailSection title="Hình ảnh / tài liệu">
                <div className="property-detail-dialog-media-content">
                  {images.length ? <ImagesPreview images={images} imgWidth={120} /> : <p>Chưa có hình ảnh</p>}
                </div>
              </DetailSection>
              <DetailSection title="Video">
                {data.Video ? <ReactPlayer width="100%" url={data.Video} controls /> : <p>Chưa có video</p>}
              </DetailSection>
            </div>
          )}

          {activeTab === "phone" && (
            <DetailSection title="Liên hệ">
              <div className="property-detail property-detail-dialog-phone">
                <ContactSection data={data} />
                <div className="pd-contact-row"><span className="pd-label">Hoa hồng</span><span className="pd-value">{display(data.Commission) || "—"}</span></div>
                <WarehouseSection data={data} defaultExpanded compact />
              </div>
            </DetailSection>
          )}

          {activeTab === "map" && (
            <DetailSection title="Bản đồ xem vị trí">
              <div className="property-detail"><PropertyMap data={data} height={568} /></div>
            </DetailSection>
          )}

          {activeTab === "history" && (
            <DetailSection title="Lịch sử thay đổi">
              <div className="property-detail-dialog-history">
                <HistoryTree instanceId={data.Id} TableName="tblProp" />
              </div>
            </DetailSection>
          )}
        </div>
        <footer className="property-detail-dialog-footer">
          {onEdit && <button type="button" onClick={onEdit}>Chỉnh sửa</button>}
          <button type="button" onClick={() => router.push(`${AppRoutes.feed.url}/add?propId=${data.Id}`)}>Đăng tin</button>
        </footer>
      </div>
      ) : null}
    </LucideModal>
  );
};

export default PropertyDetailDialog;
