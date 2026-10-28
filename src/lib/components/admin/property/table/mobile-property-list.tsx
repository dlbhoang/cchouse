import { Empty, Pagination, Skeleton, Tag, Tooltip } from "antd";
import {
  ArrowUpRight,
  Copy,
  History,
  Image as ImageIcon,
  MapPin,
  ShoppingCart,
  Video,
} from "lucide-react";
import CustomerPhoneButton from "@/lib/components/shared/Button/customer-phone";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { IPropCompare } from "@/lib/interfaces/Property/IPropCompare";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { IUserLogged } from "@/types/next-auth";

type Props = {
  data: IPropResponse[];
  loading: boolean;
  total: number;
  searchOptions: IPropAdminOpts;
  user?: IUserLogged;
  listCompare: IPropCompare[];
  onPageChange: (pageIndex: number, pageSize: number) => void;
  onOpenDetail?: (id: number) => void;
  onOpenContact: (id: number) => void;
  onOpenHistory: (id: number) => void;
  onOpenImages: (id: number) => void;
  onOpenVideo: (video: string) => void;
  onToggleSaved: (id: number) => void;
  onCompare: (item: IPropCompare) => void;
};

const MobilePropertyList = ({
  data,
  loading,
  total,
  searchOptions,
  user,
  listCompare,
  onPageChange,
  onOpenDetail,
  onOpenContact,
  onOpenHistory,
  onOpenImages,
  onOpenVideo,
  onToggleSaved,
  onCompare,
}: Props) => {
  const currentPage = Number(searchOptions.pageIndex ?? 1);
  const pageSize = Number(searchOptions.pageSize ?? 10);

  return (
    <section className="mobile-property-list" aria-label="Danh sách nhà bán">
      {loading ? (
        <div className="mobile-property-skeleton-list" aria-label="Đang tải bất động sản">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="mobile-property-skeleton-card" key={index}>
              <Skeleton active title={{ width: "42%" }} paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      ) : data.length > 0 ? (
        <>
          <div className="mobile-property-cards">
            {data.map((property) => {
              const address =
                property.PropAddress.DisplayAddress ||
                [
                  property.PropAddress.AddressNumber,
                  property.PropAddress.SubAddressName,
                  property.PropAddress.StreetName,
                ]
                  .filter(Boolean)
                  .join(" ");
              const place = [
                property.PropAddress.WardName,
                property.PropAddress.DistrictName,
                property.PropAddress.ProvinceName,
              ]
                .filter(Boolean)
                .join(", ");
              const isCompared = listCompare.some(
                (item) => item.Id === property.Id,
              );
              const canSeePhone =
                !property.IsHidePhone ||
                property.UserAdminId === user?.Id ||
                user?.RoleName === "Admin";

              return (
                <article className="mobile-property-card" key={property.Id}>
                  <div className="mobile-property-card-heading">
                    <span className="mobile-property-id">Mã {property.Id}</span>
                    <div className="mobile-property-tags">
                      <Tag color="processing">{property.StatusName}</Tag>
                      {property.IsMonopoly && <Tag color="orange">Độc quyền</Tag>}
                    </div>
                  </div>

                  <div className="mobile-property-price-row">
                    <strong>{property.DisplayPrice}</strong>
                    {property.PricePerSquareMeter && (
                      <span>{property.PricePerSquareMeter}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="mobile-property-address"
                    onClick={() => onOpenDetail?.(property.Id)}
                    aria-label={`Xem chi tiết bất động sản ${property.Id}: ${address}`}
                  >
                    {address || "Chưa có địa chỉ"}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </button>

                  {place && (
                    <p className="mobile-property-place">
                      <MapPin size={15} aria-hidden="true" />
                      <span>{place}</span>
                    </p>
                  )}

                  <div className="mobile-property-facts">
                    {property.PropAddress.PropTypeName && (
                      <span>{property.PropAddress.PropTypeName}</span>
                    )}
                    {property.Area > 0 && (
                      <span>
                        {property.Area} m²
                        {property.Length > 0 &&
                          property.Width > 0 &&
                          ` (${property.Length}×${property.Width}m)`}
                      </span>
                    )}
                    {property.CustomDisplayStructures && (
                      <span>{property.CustomDisplayStructures}</span>
                    )}
                    {property.PropAddress.LocationName && (
                      <span>{property.PropAddress.LocationName}</span>
                    )}
                    {property.PropAddress.DirectionName && (
                      <span>Hướng {property.PropAddress.DirectionName}</span>
                    )}
                  </div>

                  <div className="mobile-property-actions">
                    <div className="mobile-property-contact">
                      {canSeePhone ? (
                        <CustomerPhoneButton
                          typeName={property.CustomerTypeName}
                          aria-label="Liên hệ khách hàng"
                          onClick={() => onOpenContact(property.Id)}
                        />
                      ) : (
                        <Tag>Ẩn SĐT</Tag>
                      )}
                    </div>

                    <div className="mobile-property-action-group">
                      {property.MainImage && (
                        <Tooltip title="Xem hình ảnh">
                          <button
                            type="button"
                            className="mobile-property-action"
                            aria-label="Xem hình ảnh bất động sản"
                            onClick={() => onOpenImages(property.Id)}
                          >
                            <ImageIcon size={16} aria-hidden="true" />
                          </button>
                        </Tooltip>
                      )}
                      {property.Video && (
                        <Tooltip title="Xem video">
                          <button
                            type="button"
                            className="mobile-property-action"
                            aria-label="Xem video bất động sản"
                            onClick={() => onOpenVideo(property.Video)}
                          >
                            <Video size={16} aria-hidden="true" />
                          </button>
                        </Tooltip>
                      )}
                      <Tooltip title="Lịch sử">
                        <button
                          type="button"
                          className="mobile-property-action"
                          aria-label="Xem lịch sử bất động sản"
                          onClick={() => onOpenHistory(property.Id)}
                        >
                          <History size={16} aria-hidden="true" />
                        </button>
                      </Tooltip>
                      <Tooltip title={property.IsSaved ? "Bỏ lưu" : "Lưu giỏ hàng"}>
                        <button
                          type="button"
                          className={`mobile-property-action ${property.IsSaved ? "is-active" : ""}`}
                          aria-label={property.IsSaved ? "Bỏ lưu bất động sản" : "Lưu bất động sản"}
                          onClick={() => onToggleSaved(property.Id)}
                        >
                          <ShoppingCart size={16} aria-hidden="true" />
                        </button>
                      </Tooltip>
                      <Tooltip title={isCompared ? "Bỏ so sánh" : "Lưu so sánh"}>
                        <button
                          type="button"
                          className={`mobile-property-action ${isCompared ? "is-active" : ""}`}
                          aria-label={isCompared ? "Bỏ bất động sản khỏi so sánh" : "So sánh bất động sản"}
                          onClick={() =>
                            onCompare({
                              Id: property.Id,
                              Image: property.MainImage
                                ? property.MainImage.Path
                                : "/home.jpg",
                              DisplayPrice: property.DisplayPrice,
                              DisplayAddress: property.PropAddress.DisplayAddress,
                            })
                          }
                        >
                          <Copy size={16} aria-hidden="true" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mobile-property-pagination">
            <span>{total} bất động sản</span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              size="small"
              showSizeChanger
              pageSizeOptions={[10, 20, 30]}
              showLessItems
              onChange={(page, size) => onPageChange(page, size)}
            />
          </div>
        </>
      ) : (
        <div className="mobile-property-empty">
          <Empty description="Không tìm thấy bất động sản phù hợp" />
        </div>
      )}
    </section>
  );
};

export default MobilePropertyList;
