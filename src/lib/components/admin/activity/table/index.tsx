import { Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";

import TableBase from "@/lib/components/shared/TableBase";
import historyApi from "@/services/api/history/historyApi";
import { IHistory, IHistoryOpts } from "@/services/api/history/IHistory";

import columns from "./columns";

type Props = {
  searchOptions: IHistoryOpts;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
};
export const ActivityTable = ({ searchOptions, onPageIndexChange }: Props) => {
  const [data, setData] = useState<IHistory[]>([]);
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      const result = await historyApi.get(searchOptions);
      setData(result.data);
      setTotal(result.totalRow);
      setLoading(false);
    };
    fetch();
  }, [searchOptions]);

  return (
    <>
      <Row justify="space-between">
        <Col>
          Tìm được <Typography.Text strong>{total ?? 0}</Typography.Text> kết
          quả
        </Col>
      </Row>
      <TableBase
        loading={loading}
        total={total ?? 0}
        searchOptions={searchOptions}
        data={data ?? []}
        cols={columns}
        bordered
        onPageIndexChange={onPageIndexChange}
      />
    </>
  );
};
