"use client";
import { PlusOutlined } from "@ant-design/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { mutate } from "swr";
import PropertyFilter from "@/lib/components/admin/property/filter";
import { PropertyTable } from "@/lib/components/admin/property/table";
import PropertyDetailDialog from "@/lib/components/admin/property/detail-dialog";
import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import type { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import PropertyFormModal from "@/lib/pages/property/prop-detail";
import propertyApi from "@/services/api/property/propertyApi";

type Props = {
  transType: ETransType;
};

// Lưu ý: PriceFrm/PriceTo hiện đang giả định đơn vị "tỷ". Nếu backend trả về
// giá trị thô (VNĐ) thì cần format lại (chia 1_000_000_000 hoặc dùng hàm format tiền tệ có sẵn).
const buildFilterSummary = (
  searchOptions: IPropAdminOpts,
  transType: ETransType
) => {
  const parts: string[] = [];

  parts.push(transType === ETransType.sell ? "Đang bán" : "Đang cho thuê");

  const priceFrm = searchOptions?.PriceFrm;
  const priceTo = searchOptions?.PriceTo;
  if (priceTo && !priceFrm) {
    parts.push(`giá dưới ${priceTo} tỷ`);
  } else if (priceFrm && priceTo) {
    parts.push(`giá từ ${priceFrm} - ${priceTo} tỷ`);
  } else if (priceFrm && !priceTo) {
    parts.push(`giá trên ${priceFrm} tỷ`);
  }

  const areaFrm = searchOptions?.AreaFrm;
  const areaTo = searchOptions?.AreaTo;
  if (areaFrm && areaTo) {
    parts.push(`từ ${areaFrm}m² - ${areaTo}m²`);
  } else if (areaFrm && !areaTo) {
    parts.push(`diện tích trên ${areaFrm}m²`);
  } else if (!areaFrm && areaTo) {
    parts.push(`diện tích dưới ${areaTo}m²`);
  }

  return parts.join(", ");
};

const PropertyPage = ({ transType }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState<number>();
  const [selectedProperty, setSelectedProperty] = useState<IPropResponse>();
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [resultsTotal, setResultsTotal] = useState(0);
  const [addTransType, setAddTransType] = useState(transType);
  const [addQuery, setAddQuery] = useState<{
    AddressNumber?: string;
    ProvinceId?: string;
    DistrictId?: string;
    WardId?: string;
    StreetId?: string;
  }>();

  const searchOptions = {
    ...Object.fromEntries(query?.entries() ?? []),
    TransType: transType,
    pageSize: Number(query?.get("pageSize")) || 10,
  } as any as IPropAdminOpts;

  const { data: meta, mutate: mutateMeta } = propertyApi.useGetMeta(
    objToQueryString(searchOptions)
  );

  const modalParams = useMemo(() => {
    const openPropId = query?.get("openPropId");
    const action = query?.get("action");

    return {
      openPropId: openPropId ? Number(openPropId) : undefined,
      isAddAction: action === "add",
      addressNumber: query?.get("AddressNumber") ?? undefined,
      provinceId: query?.get("ProvinceId") ?? undefined,
      districtId: query?.get("DistrictId") ?? undefined,
      wardId: query?.get("WardId") ?? undefined,
      streetId: query?.get("StreetId") ?? undefined,
    };
  }, [query]);

  const clearModalParams = useCallback(() => {
    const params = new URLSearchParams(query?.toString() ?? "");
    params.delete("openPropId");
    params.delete("action");
    params.delete("AddressNumber");
    params.delete("ProvinceId");
    params.delete("DistrictId");
    params.delete("WardId");
    params.delete("StreetId");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, query, router]);

  const handleCloseModal = useCallback(() => {
    setFormModalOpen(false);
    setSelectedPropId(undefined);
    setSelectedProperty(undefined);
    setDetailLoading(false);
    setDetailError(false);
    setAddQuery(undefined);
    clearModalParams();
  }, [clearModalParams]);

  const handleOpenDetail = useCallback((id: number) => {
    setSelectedPropId(id);
    setSelectedProperty(undefined);
    setDetailError(false);
    setAddQuery(undefined);
    setFormModalOpen(false);
  }, []);

  const handleOpenAdd = useCallback(
    (opts?: {
      transType?: ETransType;
      query?: {
        AddressNumber?: string;
        ProvinceId?: string;
        DistrictId?: string;
        WardId?: string;
        StreetId?: string;
      };
    }) => {
      setSelectedPropId(undefined);
      setSelectedProperty(undefined);
      setAddTransType(opts?.transType ?? transType);
      setAddQuery(opts?.query);
      setFormModalOpen(true);
    },
    [transType]
  );

  useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      if (!selectedPropId) {
        setSelectedProperty(undefined);
        setDetailLoading(false);
        return;
      }

      setDetailLoading(true);
      setDetailError(false);
      try {
        const response = await propertyApi.getById(selectedPropId);
        if (!response.data?.Id) throw new Error("Property not found");
        if (active) setSelectedProperty(response.data);
      } catch {
        if (active) setDetailError(true);
      } finally {
        if (active) setDetailLoading(false);
      }
    };

    fetchDetail();
    return () => {
      active = false;
    };
  }, [selectedPropId]);

  useEffect(() => {
    if (modalParams.openPropId) {
      setSelectedPropId(modalParams.openPropId);
      setSelectedProperty(undefined);
      setDetailError(false);
      setAddQuery(undefined);
      setFormModalOpen(false);
      return;
    }

    if (modalParams.isAddAction) {
      setSelectedPropId(undefined);
      setSelectedProperty(undefined);
      setAddTransType(transType);
      setAddQuery({
        AddressNumber: modalParams.addressNumber,
        ProvinceId: modalParams.provinceId,
        DistrictId: modalParams.districtId,
        WardId: modalParams.wardId,
        StreetId: modalParams.streetId,
      });
      setFormModalOpen(true);
    }
  }, [
    modalParams.addressNumber,
    modalParams.districtId,
    modalParams.isAddAction,
    modalParams.openPropId,
    modalParams.provinceId,
    modalParams.streetId,
    modalParams.wardId,
    transType,
  ]);

  const handleFilter = (values: IPropAdminOpts) => {
    console.log("filter ", values);
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({
        ...searchOptions,
        pageIndex,
        pageSize,
      })}`
    );
  };

  const title =
    meta?.data.Title && meta.data.Title !== ""
      ? meta.data.Title
      : transType === ETransType.sell
        ? "Quản lý nhà bán"
        : "Quản lý nhà thuê";
  const filterSummary = buildFilterSummary(searchOptions, transType);

  return (
    searchOptions && (
      <>
        <div className="property-page-content">
          <PropertyFilter onSubmit={handleFilter} model={searchOptions} />

              <div className="property-page-header">
                <div>
                  <div className="property-page-title-row">
                    <h1>{title}</h1>
                    <button
                      type="button"
                      onClick={() => handleOpenAdd()}
                      className="property-add-icon-button"
                      aria-label="Thêm mới bất động sản"
                      title="Thêm mới"
                    >
                      <PlusOutlined />
                    </button>
                  </div>
                  <p>
                    Hiện có <b>{resultsTotal}</b> bất động sản được tìm kiếm theo: {filterSummary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAdd()}
                  className="property-add-button"
                >
                  <PlusOutlined />
                  Thêm mới
                </button>
              </div>

              <div className="property-table-area">
                <PropertyTable
                  searchOptions={searchOptions}
                  onPageIndexChange={handlePageIndexChange}
                  onOpenDetail={handleOpenDetail}
                  onOpenAdd={handleOpenAdd}
                  onTotalChange={setResultsTotal}
                />
              </div>
        </div>

        <PropertyFormModal
          open={formModalOpen}
          onClose={handleCloseModal}
          onSuccess={() => {
            mutate(propertyApi.mutateKey);
            mutateMeta();
          }}
          id={selectedPropId}
          transType={addTransType}
          query={addQuery}
        />
        <PropertyDetailDialog
          open={Boolean(selectedPropId)}
          data={selectedProperty}
          loading={detailLoading}
          error={detailError}
          onClose={handleCloseModal}
        />
      </>
    )
  );
};

export default PropertyPage;
