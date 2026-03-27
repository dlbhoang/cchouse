import { Col, Row, Typography } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import TableBase from "@/lib/components/shared/TableBase";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { IRecruitmentOpts } from "@/lib/interfaces/filter/ISearchOptions";
import recruitmentApi from "@/services/api/recruitment/recruitmentApi";
import RecruitmentFilter from "../filter";
import columns from "./columns";

export const RecruitmentTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const opts = {
    ...Object.fromEntries(query?.entries() ?? []),
  } as any as IRecruitmentOpts;
  const { data, isLoading, isValidating } = recruitmentApi.useGet(opts);

  const handleFilter = (values: IRecruitmentOpts) => {
    console.log("filter ", values);
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({ ...opts, pageIndex, pageSize })}`
    );
  };

  return (
    <>
      <RecruitmentFilter model={opts} onSubmit={handleFilter} />
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
