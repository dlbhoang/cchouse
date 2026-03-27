import { Col, Row, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";

import TableBase from "@/lib/components/shared/TableBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import branchApi from "@/services/api/branch/branchApi";
import { IBranchRequest, IBranchResponse } from "@/services/api/branch/IBranch";

import columns from "./columns";

type Props = {
  searchOptions: ISearchOptions;
  onEdit: (item: IBranchRequest) => void;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
};
export const BranchTable = ({
  searchOptions,
  onEdit,
  onPageIndexChange,
}: Props) => {
  // const router = useRouter();
  const { data, isLoading, isValidating, mutate } =
    branchApi.useGet(searchOptions);

  const cols: ColumnsType<IBranchResponse> = columns({
    onEdit,
  });

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
        searchOptions={searchOptions}
        data={data?.data ?? []}
        cols={cols}
        bordered
        onPageIndexChange={onPageIndexChange}
      />
    </>
  );
};
