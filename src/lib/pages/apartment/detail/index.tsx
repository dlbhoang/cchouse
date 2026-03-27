"use client";
import { useEffect, useState } from "react";

import ApartmentForm from "@/lib/components/admin/apartment/form";
import apartmentApi from "@/services/api/apartment/apartmentApi";
import type { IApartmentResponse } from "@/services/api/apartment/IApartment";

type Props = {
  id: number;
};
const ApartmentDetail = ({ id }: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IApartmentResponse>();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (id) {
        const result = await apartmentApi.getById(id);
        if (result.data) {
          setData(result.data);
        }
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return <ApartmentForm mode="tab" model={data} />;
};

export default ApartmentDetail;
