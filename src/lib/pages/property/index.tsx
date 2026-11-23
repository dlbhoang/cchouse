"use client";

import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import PropertyFilter from "@/lib/components/admin/property/filter";
import { PropertyTable } from "@/lib/components/admin/property/table";
import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
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

  const [resultsTotal, setResultsTotal] = useState(0);

  const searchOptions = useMemo(() => ({
    ...Object.fromEntries(query?.entries() ?? []),
    TransType: transType,
    pageSize: Number(query?.get("pageSize")) || 10,
  } as any as IPropAdminOpts), [query, transType]);

  const { data: meta } = propertyApi.useGetMeta(
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

  const handleOpenDetail = useCallback((id: number) => {
    const params = new URLSearchParams({ returnTo: `${pathname}?${query?.toString() ?? ""}` });
    router.push(`/admin/property/${id}?${params}`);
  }, [pathname, query, router]);

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
      const params = new URLSearchParams({
        TransType: String(opts?.transType ?? transType),
      });
      for (const [key, value] of Object.entries(opts?.query ?? {})) {
        if (value) params.set(key, String(value));
      }
      router.push(`/admin/property/add?${params.toString()}`);
    },
    [router, transType]
  );

  useEffect(() => {
    if (modalParams.openPropId) {
      router.replace(`/admin/property/${modalParams.openPropId}`);
      return;
    }

    if (modalParams.isAddAction) {
      handleOpenAdd({
        transType,
        query: {
          AddressNumber: modalParams.addressNumber,
          ProvinceId: modalParams.provinceId,
          DistrictId: modalParams.districtId,
          WardId: modalParams.wardId,
          StreetId: modalParams.streetId,
        },
      });
    }
  }, [
    handleOpenAdd,
    modalParams.addressNumber,
    modalParams.districtId,
    modalParams.isAddAction,
    modalParams.openPropId,
    modalParams.provinceId,
    modalParams.streetId,
    modalParams.wardId,
    transType,
    router,
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
                      <Plus size={16} />
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
                  <Plus size={16} />
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

      </>
    )
  );
};

export default PropertyPage;
