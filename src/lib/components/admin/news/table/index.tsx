import { Col, Row, Typography } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TableBase from "@/lib/components/shared/TableBase";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import newsApi from "@/services/api/news/newsApi";
import columns from "./columns";

export const NewsTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const opts = {
    ...Object.fromEntries(query?.entries() ?? []),
  } as any as ISearchOptions;

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({ ...opts, pageIndex, pageSize })}`
    );
  };

  const { data, isLoading, isValidating } = newsApi.useGet(opts);

  return (
    <>
      <Row justify="space-between">
        <Col>
          Tìm được{" "}
          <Typography.Text strong>{data?.totalRow ?? 0}</Typography.Text> kết
          quả
        </Col>
      </Row>
      <TableBase
        loading={isLoading || isValidating}
        total={data?.totalRow ?? 0}
        searchOptions={opts}
        data={data?.data ?? []}
        cols={columns}
        bordered
        onPageIndexChange={handlePageIndexChange}
      />
    </>
  );
};
