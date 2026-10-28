"use client";
import { Alert as LucideAlert } from "@/lib/components/antd-lucide";

import {Button, ConfigProvider} from "antd";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PropertyFilter from "@/lib/components/admin/property/filter";
import { PropListMap } from "@/lib/components/admin/property/propListMap";
import PropertyDetailDialog from "@/lib/components/admin/property/detail-dialog";
import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { hasMapCoordinates } from "@/lib/core/utils/map-coordinates";
import type { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import type { IPropAdminMap, IPropResponse } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import propertyApi from "@/services/api/property/propertyApi";
import { MapServices } from "@/services/api/services/mapServices";
import { mapReviewFixtures, mapReviewPolygon } from "./review-fixtures";
import "./map-page.css";

const MyLeaflet = dynamic(() => import("@/lib/components/leaflet"), {
  ssr: false,
});

const MapPage = () => {
  const { smallScreen, provinces, districts } = useAdminContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [detail, setDetail] = useState<IPropResponse>();
  const [detailError, setDetailError] = useState(false);
  const [polygon, setPolygon] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<IPropResponse>();
  // Main Design opens the map without the results drawer; users can show it
  // with the map toggle when they want to browse matching properties.
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const propertyId = searchParams?.get("PropertyId");
  const isMockMode = searchParams?.get("mapMock") === "1";
  const filterParams = new URLSearchParams(searchParams?.toString() ?? "");
  filterParams.delete("PropertyId");
  filterParams.delete("mapMock");
  filterParams.delete("mapBoundary");
  const filtersQuery = filterParams.toString();
  const searchOptions = useMemo(() => {
    const params = new URLSearchParams(filtersQuery);
    return {
      ...Object.fromEntries(params),
      TransType:
        Number(params.get("TransType")) === ETransType.rent
          ? ETransType.rent
          : ETransType.sell,
      ProvinceId: Number(params.get("ProvinceId")) || 1,
    } as unknown as IPropAdminOpts;
  }, [filtersQuery]);

  const {
    data: points,
    error: pointsError,
    mutate: mutatePoints,
  } = propertyApi.useGetCoordinates({
    ...searchOptions,
    pageIndex: 1,
    pageSize: 10000,
  }, !isMockMode);
  const mockProperties = useMemo(
    () =>
      isMockMode
        ? mapReviewFixtures.filter(
            (item) => item.TransType === Number(searchOptions.TransType),
          )
        : undefined,
    [isMockMode, searchOptions.TransType],
  );
  const mapPoints: IPropAdminMap[] =
    mockProperties ?? (Array.isArray(points?.data) ? points.data : []);
  const mockDetail = isMockMode
    ? mapReviewFixtures.find((item) => item.Id === Number(propertyId))
    : undefined;

  useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      setDetail(undefined);
      setDetailError(false);
      if (!propertyId) {
        return;
      }
      if (isMockMode) {
        if (mockDetail) setDetail(mockDetail);
        else setDetailError(true);
        return;
      }
      try {
        const id = Number(propertyId);
        if (!Number.isSafeInteger(id) || id <= 0)
          throw new Error("Invalid property ID");
        const response = await propertyApi.getById(id);
        if (!response.data?.Id) throw new Error("Property not found");
        if (active) setDetail(response.data);
      } catch {
        if (active) setDetailError(true);
      }
    };
    fetchDetail();
    return () => {
      active = false;
    };
  }, [isMockMode, mockDetail, propertyId]);

  useEffect(() => {
    let active = true;
    const fetchPolygon = async () => {
      const { ProvinceId, DistrictId } = Object.fromEntries(
        searchParams?.entries() ?? [],
      );
      if (!ProvinceId || !DistrictId) {
        setPolygon(
          isMockMode && searchParams?.get("mapBoundary") === "1"
            ? mapReviewPolygon
            : [],
        );
        return;
      }
      if (isMockMode) {
        setPolygon(
          searchParams?.get("mapBoundary") === "1" ? mapReviewPolygon : [],
        );
        return;
      }
      const refProvince = provinces.find(
        (item) => item.Id.toString() === ProvinceId,
      )?.RefKey;
      const refDistrict = districts.find(
        (item) => item.Id.toString() === DistrictId,
      )?.RefKey;
      try {
        const data = await MapServices.getPolygon(
          refProvince ?? "",
          refDistrict ?? "",
        );
        if (active) setPolygon((data?.[0] as any)?.coordinates ?? []);
      } catch {
        if (active) setPolygon([]);
      }
    };
    fetchPolygon();
    return () => {
      active = false;
    };
  }, [districts, isMockMode, provinces, searchParams]);

  const handleFilter = (values: IPropAdminOpts) => {
    setSelectedProperty(undefined);
    const nextOptions = { ...values } as IPropAdminOpts & {
      PropertyId?: number;
    };
    delete nextOptions.PropertyId;
    const query = new URLSearchParams(objToQueryString(nextOptions));
    if (isMockMode) query.set("mapMock", "1");
    router.push(`${pathname}?${query.toString()}`);
  };

  const closeDetail = () => {
    const nextParams = new URLSearchParams(searchParams?.toString() ?? "");
    nextParams.delete("PropertyId");
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const hasCoordinates = mapPoints.some(({ PropAddress }) =>
    hasMapCoordinates(PropAddress),
  );

  const selectProperty = (item: IPropResponse) => {
    setSelectedProperty(item);
  };
  const openPropertyDetail = (item: IPropResponse) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("PropertyId", item.Id.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const focusedProperty = selectedProperty
    ? (mapPoints.find(
        (item) =>
          item.Id === selectedProperty.Id &&
          hasMapCoordinates(item.PropAddress),
      ) ?? selectedProperty)
    : undefined;

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#0588f0", fontFamily: "Inter, sans-serif" },
        components: {
          Drawer: { colorText: "#0a0a0a" },
          Segmented: { itemSelectedBg: "#0588f0", itemSelectedColor: "#fff" },
        },
      }}
    >
      <main className="admin-map-page">
        <header className="admin-map-heading">
          <div>
            <div className="admin-map-breadcrumb">
              Bản đồ&nbsp; / &nbsp;Bản đồ nhà đất
            </div>
            <h1>BẢN ĐỒ NHÀ ĐẤT</h1>
          </div>
        </header>

        <div className="admin-map-filters">
          <PropertyFilter
            onSubmit={handleFilter}
            model={searchOptions}
            mapMode
          />
        </div>
        {detailError && (
          <LucideAlert
            type="error"
            showIcon
            message="Không tải được chi tiết bất động sản. Vui lòng thử lại."
            closable
            onClose={closeDetail}
          />
        )}

        <section
          className={`admin-map-workspace ${isResultsOpen ? "is-results-open" : "is-results-closed"}`}
        >
          <aside
            id="admin-map-results"
            hidden={!isResultsOpen}
            className={`admin-map-results ${smallScreen ? "mobile-results" : ""}`}
          >
            <PropListMap
              opts={searchOptions}
              mockData={mockProperties}
              selectedId={selectedProperty?.Id}
              onSelect={selectProperty}
              onOpenDetail={openPropertyDetail}
            />
          </aside>

          <div className="admin-map-canvas">
            <MyLeaflet
              data={mapPoints}
              polygon={polygon}
              focusedProperty={focusedProperty}
            />
            {pointsError && !isMockMode ? (
              <div className="admin-map-notice" role="status">
                Không tải được vị trí bất động sản.
                <Button type="link" onClick={() => mutatePoints()}>
                  Thử lại
                </Button>
              </div>
            ) : selectedProperty &&
              !hasMapCoordinates(focusedProperty?.PropAddress) ? (
              <div className="admin-map-notice" role="status">
                Bất động sản {selectedProperty.Id} chưa có tọa độ nên chưa thể
                di chuyển đến vị trí này. Bấm đúp vào thẻ để xem chi tiết.
              </div>
            ) : mapPoints.length > 0 && !hasCoordinates ? (
              <div className="admin-map-notice" role="status">
                Các bất động sản này chưa có tọa độ trên bản đồ.
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className={`admin-map-results-toggle ${isResultsOpen ? "is-open" : ""}`}
            aria-label={isResultsOpen ? "Ẩn danh sách bất động sản" : "Hiện danh sách bất động sản"}
            aria-expanded={isResultsOpen}
            aria-controls="admin-map-results"
            onClick={() => setIsResultsOpen((open) => !open)}
          >
            {isResultsOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </section>
        <PropertyDetailDialog
          open={Boolean(detail)}
          data={detail}
          onClose={closeDetail}
        />
      </main>
    </ConfigProvider>
  );
};

export default MapPage;
