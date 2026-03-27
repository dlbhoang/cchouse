"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import AddEditForm from "@/lib/components/admin/feed/form/addEdit";
import feedApi from "@/services/api/feed/feedApi";
import type { IFeedResponse } from "@/services/api/feed/IFeed";

type Props = {
  id?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
};

const AddFeedPage = ({ id, searchParams }: Props) => {
  const params = useSearchParams();
  const propId = searchParams?.propId || params?.get("propId");
  const unitId = searchParams?.unitId || params?.get("unitId");
  const feedId = id || searchParams?.id || params?.get("id");
  const [data, setData] = useState<IFeedResponse>();

  useEffect(() => {
    const fetchData = async () => {
      if (
        feedId ||
        (propId && Number(propId) > 0) ||
        (unitId && Number(unitId) > 0)
      ) {
        const result =
          (propId && (await feedApi.getByPropId(Number(propId)))) ||
          (unitId && (await feedApi.getByApartmentUnit(Number(unitId)))) ||
          (await feedApi.getById(Number(feedId)));

        setData(result.data);
      }
    };

    fetchData();
  }, [feedId, propId, unitId]);

  return <AddEditForm model={data} />;
};

export default AddFeedPage;
