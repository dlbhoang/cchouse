"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropAddEdit from "@/lib/components/admin/property/form/propAddEdit";
import RequestAccess from "@/lib/components/admin/property/request-access";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";
import { IPropAccess } from "@/services/property";

type Props = {
  id: number;
  query: {
    AddressNumber?: string;
    ProvinceId?: string;
    DistrictId?: string;
    WardId?: string;
    StreetId?: string;
  };
};

const PropDetailPage = ({ id, query }: Props) => {
  const router = useRouter();
  const [data, setData] = useState<IPropResponse>();
  const [accessInfo, setAccessInfo] = useState<IPropAccess>();

  useEffect(() => {
    const fetchData = async () => {
      if (accessInfo?.IsAllowed) {
        const result = await propertyApi.getById(Number(id));
        setData(result.data);
      }
    };
    fetchData();
  }, [accessInfo, id]);

  useEffect(() => {
    if (id) {
      const fetchAccessInfo = async () => {
        const result = await propertyApi.checkPropAccess(Number(id));
        setAccessInfo(result.data);
      };
      fetchAccessInfo();
    }
  }, [id, router]);

  return (
    <>
      {data && <PropAddEdit model={data} query={query} />}
      {accessInfo && !accessInfo.IsAllowed && (
        <RequestAccess model={accessInfo} />
      )}
    </>
  );
};

export default PropDetailPage;
