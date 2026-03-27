import { Col, Row } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useSession } from "next-auth/react";
import { useState } from "react";

import TableBase from "@/lib/components/shared/TableBase";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { IPropTemp, IPropTempOpts } from "@/services/api/property/model";
import propTempApi from "@/services/api/property/propTempApi";
import PropTempCompareModal from "../modal/compare";
import columns from "./columns";

type Props = {
  opts: IPropTempOpts;
};
export const PropTempTable = ({ opts }: Props) => {
  const { data, isLoading, isValidating, mutate } = propTempApi.useGet(opts);

  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSeleted] = useState<{
    propTemp: IPropTemp;
    prop: IPropResponse;
  }>();

  const cols: ColumnsType<IPropTemp> = columns({
    userSession: session?.user,
    handlePreview: async (id: number) => {
      const res = await propTempApi.getRelatedProp(id);
      setSeleted(res.data);
      setOpen(true);
    },
    handleMutate: () => mutate(),
  });

  return (
    <>
      <Row justify="space-between" gutter={[12, 12]}>
        <Col span={24}>Tìm được {data?.totalRow} kết quả</Col>
      </Row>
      <TableBase
        loading={isLoading || isValidating}
        total={data?.totalRow || 0}
        searchOptions={opts}
        data={data?.data || []}
        cols={cols}
        bordered
      />

      {selected && (
        <PropTempCompareModal
          isModalOpen={open}
          data={selected}
          handleCancel={() => setOpen(false)}
          handleOk={() => setOpen(false)}
        />
      )}
    </>
  );
};
