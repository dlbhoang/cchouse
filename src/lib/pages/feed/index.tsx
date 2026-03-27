"use client";
import { Card } from "antd";
import { usePathname, useRouter } from "next/navigation";

import FeedFilter from "@/lib/components/admin/feed/filter";
import FeedTable from "@/lib/components/admin/feed/table";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IFeedFilter } from "@/lib/interfaces/filter/ISearchOptions";
import feedApi from "@/services/api/feed/feedApi";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const FeedPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const status = Number(searchParams?.Status) || 0;
  const opts = {
    ...searchParams,
    Status: status,
    ProvinceId: 1,
  } as any as IFeedFilter;

  const { data, isLoading } = feedApi.useGet(objToQueryString(opts));

  const handleFilter = (values: IFeedFilter) => {
    console.log("filter ", values);
    router.push(`${pathname}?${objToQueryString({ ...values, pageIndex: 1 })}`);
  };

  // useEffect(() => {
  //   mutate();
  // }, [mutate, router.query]);

  return (
    <Card>
      <FeedFilter model={opts} onSubmit={handleFilter} />
      <FeedTable
        loading={isLoading}
        total={data?.totalRow ?? 0}
        searchOptions={opts}
        data={data?.data ?? []}
      />
    </Card>
  );
};

export default FeedPage;
