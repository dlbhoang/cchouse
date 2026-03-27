import { Spin } from "antd";
import { useState } from "react";
import { mutate } from "swr";
import HistoryModel from "@/lib/components/admin/property/modal/historyModal";
import TableBase from "@/lib/components/shared/TableBase";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";
import {
  EPropTransferStatus,
  type IPropTransferOpts,
  type IPropTransferResponse,
} from "@/services/property/models/prop-transfer";
import propTransferApi from "@/services/property/propTransferApi";
import columns from "./columns";

type Props = {
  data: IPropTransferResponse[];
  isLoading: boolean;
  totalCount: number;
  opts: IPropTransferOpts;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
};

const PropTransferTable = ({
  data,
  isLoading,
  totalCount,
  opts,
  onPageIndexChange,
}: Props) => {
  const [prop, setProp] = useState<IPropResponse | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const cols = columns({
    handleOpenHistory: async (id: number) => {
      //get prop by id then show modal history
      const res = await propertyApi.getById(id);
      setProp(res.data);
      setOpenHistory(true);
    },
    handleApprove: async (id: number) => {
      setIsMutating(true);
      await propTransferApi.approve({
        Id: id,
        Status: EPropTransferStatus.Approved,
      });

      mutate(`${propTransferApi.mutateKey}?${objToQueryString(opts)}`);
      setIsMutating(false);
    },
    handleMutate: () => {
      mutate(`${propTransferApi.mutateKey}?${objToQueryString(opts)}`);
    },
  });

  return (
    <>
      <Spin spinning={isMutating}>
        <TableBase
          cols={cols}
          data={data}
          total={totalCount}
          loading={isLoading}
          searchOptions={opts}
          onPageIndexChange={onPageIndexChange}
        />
      </Spin>

      {prop && (
        <HistoryModel
          isModalOpen={openHistory}
          handleCancel={() => setOpenHistory(false)}
          model={prop}
        />
      )}
    </>
  );
};

export default PropTransferTable;
