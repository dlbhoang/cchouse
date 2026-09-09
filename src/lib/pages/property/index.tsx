"use client";
import { PlusOutlined } from "@ant-design/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { mutate } from "swr";
import PropertyFilter from "@/lib/components/admin/property/filter";
import { PropertyTable } from "@/lib/components/admin/property/table";
import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
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
    ProvinceId: 1,
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
    setAddQuery(undefined);
    clearModalParams();
  }, [clearModalParams]);

  const handleOpenDetail = useCallback((id: number) => {
    setSelectedPropId(id);
    setAddQuery(undefined);
    setFormModalOpen(true);
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
      setAddTransType(opts?.transType ?? transType);
      setAddQuery(opts?.query);
      setFormModalOpen(true);
    },
    [transType]
  );

  useEffect(() => {
    if (modalParams.openPropId) {
      setSelectedPropId(modalParams.openPropId);
      setAddQuery(undefined);
      setFormModalOpen(true);
      return;
    }

    if (modalParams.isAddAction) {
      setSelectedPropId(undefined);
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
  const total = meta?.totalRow ?? 0;
  const filterSummary = buildFilterSummary(searchOptions, transType);

  return (
    searchOptions && (
      <>
        <div className="property-page-content">
          <PropertyFilter onSubmit={handleFilter} model={searchOptions} />

              <div className="property-page-header">
                <div>
                  <h1>{title}</h1>
                  <p>
                    Hiện có <b>{total}</b> bất động sản được tìm kiếm theo: {filterSummary}
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
      </>
    )
  );
};

export default PropertyPage;