"use client";
import { useEffect, useState } from "react";
import ApartmentUnitForm from "@/lib/components/admin/apartment-unit/form";
import apartmentUnitApi from "@/services/api/apartment/unit/apartmentUnitApi";
import type { IApartmentUnitResponse } from "@/services/api/apartment/unit/IApartmentUnit";

type Props = {
  id: number;
};

const ApartmentUnitDetailPage = ({ id }: Props) => {
  const [data, setData] = useState<IApartmentUnitResponse>();

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const res = await apartmentUnitApi.getById(Number(id));
        setData(res.data);
      }
    };
    fetch();
  }, [id]);

  return <ApartmentUnitForm model={data} />;
};

export default ApartmentUnitDetailPage;
