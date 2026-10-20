"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyFilter from "@/lib/components/admin/property/filter";
import { PropListMap } from "@/lib/components/admin/property/propListMap";
import { ETransType } from "@/lib/core/enum";
import { objToQueryString } from "@/lib/core/utils/app-func";
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
  const [polygon, setPolygon] = useState<any[]>([]);

  const propertyId = searchParams?.get("PropertyId");
  const transType = searchParams?.get("TransType") || ETransType.sell;
  const searchOptions = {
    ...Object.fromEntries(searchParams?.entries() ?? []),
    TransType: transType,
    ProvinceId: 1,
  } as any as IPropAdminOpts;

  const { data: points, mutate: mutatePoints } = propertyApi.useGetCoordinates({
    ...searchOptions,
    pageIndex: 1,
    pageSize: 10000,
  });

  useEffect(() => {
    mutatePoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      if (!propertyId) {
        setDetail(undefined);
        return;
      }
      const response = await propertyApi.getById(Number(propertyId));
      if (active) {
        setDetail(response.data);
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
        searchParams?.entries() ?? []
      );
      if (!ProvinceId || !DistrictId) {
        setPolygon([]);
        return;
      }
      const refProvince = provinces.find((item) => item.Id.toString() === ProvinceId)?.RefKey;
      const refDistrict = districts.find((item) => item.Id.toString() === DistrictId)?.RefKey;
      const data = await MapServices.getPolygon(refProvince ?? "", refDistrict ?? "");
      if (active) setPolygon((data?.[0] as any)?.coordinates?.[0] ?? []);
    };
    fetchPolygon();
    return () => {
      active = false;
    };
  }, [districts, provinces, searchParams]);

  const handleFilter = (values: IPropAdminOpts) => {
    const nextOptions = { ...values } as IPropAdminOpts & { PropertyId?: number };
    delete nextOptions.PropertyId;
    router.push(`${pathname}?${objToQueryString(nextOptions)}`);
  };

  const closeDetail = () => {
    const nextParams = new URLSearchParams(searchParams?.toString() ?? "");
    nextParams.delete("PropertyId");
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  return (
    <main className="admin-map-page">
      <header className="admin-map-heading">
        <div>
          <div className="admin-map-breadcrumb">Bản đồ&nbsp; / &nbsp;Bản đồ nhà đất</div>
          <h1>BẢN ĐỒ NHÀ ĐẤT</h1>
        </div>
      </header>

      <div className="admin-map-filters">
        <PropertyFilter onSubmit={handleFilter} model={searchOptions} mapMode />
      </div>

      <section className="admin-map-workspace has-panel">
        <aside className={`admin-map-results ${smallScreen ? "mobile-results" : ""}`}>
          <PropListMap opts={searchOptions} />
        </aside>

        <div className="admin-map-canvas">
          <MyLeaflet
            data={Array.isArray(points?.data) ? points.data : []}
            polygon={polygon}
          />
        </div>
      </section>
      {detail && <PropMapDetail data={detail} onClose={closeDetail} />}
    </main>
  );
};

export default MapPage;
