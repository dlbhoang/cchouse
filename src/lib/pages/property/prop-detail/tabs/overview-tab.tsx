"use client";

import { Checkbox } from "antd";
import { ETransType } from "@/lib/core/enum";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import ContactSection from "../components/contact-section";
import {
  DetailField,
  DetailGrid,
  DetailSection,
} from "../components/detail-field";
import MediaGallery from "../components/media-gallery";
import PropertyMap from "../components/property-map";
import WarehouseSection from "../components/warehouse-section";
import {
  displayValue,
  formatAlleyTurn,
  formatCommission,
  formatPropertyAddress,
  formatStreetWidth,
  formatStructures,
  getEnumName,
  getEnumNames,
} from "../detail-utils";

type Props = {
  data: IPropResponse;
  images: IMyUploadFile[];
  showAllSections?: boolean;
};

const OverviewTab = ({ data, images, showAllSections = true }: Props) => {
  const { enumList } = useAdminContext();
  const priceLabel =
    data.TransType === ETransType.sell ? "Giá bán" : "Giá thuê";
  const structureText = formatStructures(enumList.Structures, data);

  return (
    <div>
      <div className="pd-header-row">
        <div className="pd-header-item">
          <span className="pd-label">Mã BĐS</span>
          <span className="pd-value-strong">{data.Id}</span>
        </div>
        <div className="pd-header-item">
          <span className="pd-label">Địa chỉ</span>
          <span className="pd-value">{formatPropertyAddress(data)}</span>
        </div>
      </div>

      <DetailSection title="Tổng quan bất động sản">
        <DetailGrid>
          <DetailField label="Trạng thái" value={data.StatusName} />
          <DetailField
            label="Loại BĐS"
            value={data.PropAddress.PropTypeName}
          />
          <DetailField
            label="Tên bất động sản"
            value={displayValue(data.PropAddress.PropName)}
          />
          <DetailField
            label="Loại đất"
            value={getEnumName(enumList.UsageLaw, data.PropAddress.UsageLaw)}
          />
          <DetailField
            label="Tình trạng nhà"
            value={data.PropAddress.StatusUsageName}
          />
          <DetailField
            label={priceLabel}
            value={data.DisplayPrice}
            highlight
            number
          />
          <DetailField
            label="Pháp lý"
            value={data.PropAddress.DisplayLaws?.join(", ") || "--"}
          />
          <DetailField
            label="Hoa hồng"
            number
            value={formatCommission(data.Commission) ?? "--"}
          />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Loại hình / Vị trí">
        <DetailGrid>
          <DetailField
            label="Vị trí"
            value={
              <div className="flex flex-wrap items-center gap-2">
                <span>{data.PropAddress.LocationName || "--"}</span>
                {data.PropAddress.IsOneWay && (
                  <Checkbox checked disabled className="pd-oneway-check">
                    1 chiều
                  </Checkbox>
                )}
              </div>
            }
          />
          <DetailField
            label="Độ rộng đường (m)"
            value={formatStreetWidth(data.PropAddress.StreetWidth)}
          />
          <DetailField
            label="Đặc điểm"
            value={data.PropAddress.LocationFeatureName}
          />
          <DetailField
            label="Hướng"
            value={data.PropAddress.DirectionName}
          />
          <DetailField
            label="Số lần rẽ"
            value={displayValue(data.PropAddress.AlleyTurns)}
          />
          {data.PropAddress.AlleyValues?.map((value, index) => (
            <DetailField
              key={`alley-${index}`}
              label={`Lần rẽ ${index + 1} (m)`}
              value={formatAlleyTurn(value)}
            />
          ))}
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Diện tích / Hiện trạng">
        <DetailGrid>
          <DetailField label="Chiều rộng" value={displayValue(data.Width)} />
          <DetailField label="Chiều dài" value={displayValue(data.Length)} />
          <DetailField label="Mặt hậu" value={displayValue(data.BackSide)} />
          <DetailField
            label="Tổng DTTT"
            value={
              data.Area ? `${data.Area} m²` : displayValue(data.Area)
            }
          />
          <DetailField label="Hiện trạng" value={structureText} />
        </DetailGrid>

        <div className="pd-subgrid">
          <DetailGrid>
            <DetailField
              label="Chiều rộng"
              value={displayValue(data.PropAddress.WidthLegal)}
            />
            <DetailField
              label="Chiều dài"
              value={displayValue(data.PropAddress.LengthLegal)}
            />
            <DetailField
              label="Mặt hậu"
              value={displayValue(data.PropAddress.BackSideLegal)}
            />
            <DetailField
              label="Tổng DTCN"
              value={
                data.PropAddress.AreaLegal
                  ? `${data.PropAddress.AreaLegal} m²`
                  : displayValue(data.PropAddress.AreaLegal)
              }
            />
            <DetailField
              label="Tổng DT sàn"
              value={
                data.FloorArea
                  ? `${data.FloorArea} m²`
                  : displayValue(data.FloorArea)
              }
            />
          </DetailGrid>
        </div>
      </DetailSection>

      <DetailSection title="Trang bị / Tiện ích">
        <DetailGrid>
          <DetailField label="Số phòng" value={displayValue(data.Bedroom)} />
          <DetailField label="Số toilet" value={displayValue(data.Bathroom)} />
          <DetailField
            label="Trang thiết bị"
            value={data.DisplayEquipments?.join(", ") || "--"}
          />
          <DetailField
            label="Tiện ích"
            value={data.DisplayUtilities?.join(", ") || "--"}
          />
          <DetailField label="Nội thất" value={displayValue(data.Furniture)} />
          <DetailField
            label="Lỗi phong thủy"
            value={getEnumNames(enumList.Errors, data.PropAddress.Errors)}
          />
        </DetailGrid>
      </DetailSection>

      {showAllSections && (
        <>
          <DetailSection title="Hình ảnh & Video">
            <MediaGallery images={images} videoUrl={data.Video} />
          </DetailSection>

          <DetailSection title="Liên hệ">
            <ContactSection data={data} />
          </DetailSection>

          <div className="pd-section">
            <WarehouseSection data={data} />
          </div>

          <DetailSection title="Bản đồ">
            <PropertyMap data={data} height={360} />
          </DetailSection>
        </>
      )}
    </div>
  );
};

export default OverviewTab;
