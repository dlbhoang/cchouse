"use client";
import { Button, Space } from "antd";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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

const MyLeaflet = dynamic(() => import("@/lib/components/leaflet"), {
  ssr: false,
});

const MapPage = () => {
  const { smallScreen, provinces, districts } = useAdminContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const toggleVisible = () => {
    setVisible(!visible);
  };
  const [detail, setDetail] = useState<IPropResponse>();

  const router = useRouter();
  const PropertyId = searchParams?.get("PropertyId");
  const TransType = searchParams?.get("TransType") || ETransType.sell;
  const searchOptions = {
    ...Object.fromEntries(searchParams?.entries() ?? []),
    TransType,
    ProvinceId: 1,
  } as any as IPropAdminOpts;

  const { data: points, mutate: mutatePoints } = propertyApi.useGetCoordinates({
    ...searchOptions,
    pageIndex: 1,
    pageSize: 10000,
  });

  const [geo, setGeo] = useState<any>();
  useEffect(() => {
    const fetchGeoJSON = async () => {
      console.log("fetchGeoJSON");

      const response = await fetch("/data/vnm.geo.json");
      const geoJSON = await response.json();
      setGeo(geoJSON);
    };

    fetchGeoJSON();
  }, []);

  useEffect(() => {
    mutatePoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleFilter = (values: IPropAdminOpts) => {
    console.log("filter ", values);
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

  useEffect(() => {
    const fetch = async () => {
      if (PropertyId) {
        const res = await propertyApi.getById(Number(PropertyId));
        setDetail(res.data);
        setVisible(true);
      } else {
        setDetail(undefined);
      }
    };
    fetch();
  }, [PropertyId]);

  const [polygon, setPolygon] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { ProvinceId, DistrictId } = Object.fromEntries(
        searchParams?.entries() ?? []
      );

      if (ProvinceId && DistrictId) {
        const refProvince = provinces.find(
          (x) => x.Id.toString() === ProvinceId
        )?.RefKey;
        const refDistrict = districts.find(
          (x) => x.Id.toString() === DistrictId
        )?.RefKey;

        const data = await MapServices.getPolygon(
          refProvince ?? "",
          refDistrict ?? ""
        );
        console.log("data polygon", (data?.[0] as any)?.coordinates[0]);
        setPolygon((data?.[0] as any)?.coordinates[0]);
      }
    };
    fetch();
  }, [districts, provinces, searchParams]);

  return (
    <div
      style={{
        width: "100%",
        zIndex: 30,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          maxWidth: !smallScreen ? "60%" : "100%",
          top: 10,
          height: "auto",
          zIndex: 1000,
          // backgroundColor: '#E5E7EB',
          padding: 8,
        }}
      >
        <PropertyFilter onSubmit={handleFilter} model={searchOptions} />
      </div>
      <div
        style={{
          position: "absolute",
          width: "auto",
          zIndex: 1000,
          float: "left",
          right: 0,
          top: 0,
        }}
      >
        {!smallScreen ? (
          <Space align="center" size="small" style={{ height: "85vh" }}>
            <Button
              onClick={toggleVisible}
              style={{ height: 50, backgroundColor: "orange" }}
              type="primary"
              icon={
                visible ? (
                  <ChevronRightIcon size={25} className="text-white" />
                ) : (
                  <ChevronLeftIcon size={25} className="text-white" />
                )
              }
            />
            {visible &&
              (detail ? (
                <PropMapDetail data={detail} />
              ) : (
                <PropListMap opts={searchOptions} />
              ))}
          </Space>
        ) : (
          visible && detail && <PropMapDetail data={detail} />
        )}
      </div>

      {geo && (
        <MyLeaflet data={points?.data ?? []} geo={geo} polygon={polygon} />
      )}
    </div>
  );
};

export default MapPage;
