"use client";

import { Alert, Button, ConfigProvider } from "antd";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PropertyFilter from "@/lib/components/admin/property/filter";
import { PropListMap } from "@/lib/components/admin/property/propListMap";
import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { hasMapCoordinates } from "@/lib/core/utils/map-coordinates";
import type { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import propertyApi from "@/services/api/property/propertyApi";
import { MapServices } from "@/services/api/services/mapServices";
import PropMapDetail from "./propDetail";
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

  const propertyId = searchParams?.get("PropertyId");
  const filterParams = new URLSearchParams(searchParams?.toString() ?? "");
  filterParams.delete("PropertyId");
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
  });

  useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      setDetail(undefined);
      setDetailError(false);
      if (!propertyId) {
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
  }, [propertyId]);

  useEffect(() => {
    let active = true;
    const fetchPolygon = async () => {
      const { ProvinceId, DistrictId } = Object.fromEntries(
        searchParams?.entries() ?? [],
      );
      if (!ProvinceId || !DistrictId) {
        setPolygon([]);
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
        if (active) setPolygon((data?.[0] as any)?.coordinates?.[0] ?? []);
      } catch {
        if (active) setPolygon([]);
      }
    };
    fetchPolygon();
    return () => {
      active = false;
    };
  }, [districts, provinces, searchParams]);

  const handleFilter = (values: IPropAdminOpts) => {
    const nextOptions = { ...values } as IPropAdminOpts & {
      PropertyId?: number;
    };
    delete nextOptions.PropertyId;
    router.push(`${pathname}?${objToQueryString(nextOptions)}`);
  };

  const closeDetail = () => {
    const nextParams = new URLSearchParams(searchParams?.toString() ?? "");
    nextParams.delete("PropertyId");
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const mapPoints = Array.isArray(points?.data) ? points.data : [];
  const hasCoordinates = mapPoints.some(({ PropAddress }) =>
    hasMapCoordinates(PropAddress),
  );

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
          <Alert
            type="error"
            showIcon
            message="Không tải được chi tiết bất động sản. Vui lòng thử lại."
            closable
            onClose={closeDetail}
          />
        )}

        <section className="admin-map-workspace has-panel">
          <aside
            className={`admin-map-results ${smallScreen ? "mobile-results" : ""}`}
          >
            <PropListMap opts={searchOptions} />
          </aside>

          <div className="admin-map-canvas">
            <MyLeaflet data={mapPoints} polygon={polygon} />
            {pointsError ? (
              <div className="admin-map-notice" role="status">
                Không tải được vị trí bất động sản.
                <Button type="link" onClick={() => mutatePoints()}>
                  Thử lại
                </Button>
              </div>
            ) : mapPoints.length > 0 && !hasCoordinates ? (
              <div className="admin-map-notice" role="status">
                Các bất động sản này chưa có tọa độ trên bản đồ.
              </div>
            ) : null}
          </div>
        </section>
        {detail && <PropMapDetail data={detail} onClose={closeDetail} />}
      </main>
    </ConfigProvider>
  );
};

export default MapPage;
