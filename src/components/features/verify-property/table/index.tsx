import { useState } from "react";
import TableBase from "@/lib/components/shared/TableBase";
import type {
  IPropTransferOpts,
  IPropTransferResponse,
} from "@/services/property/models/prop-transfer";
import DetailModal from "../detail-modal";
import columns from "./columns";

type Props = {
  data: IPropTransferResponse[];
  isLoading: boolean;
  totalCount: number;
  opts: IPropTransferOpts;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
};

const VerifyPropertyTable = ({
  data,
  isLoading,
  totalCount,
  opts,
  onPageIndexChange,
}: Props) => {
  const [selectedTransfer, setSelectedTransfer] =
    useState<IPropTransferResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const cols = columns({
    handleOpenDetail: (transfer: IPropTransferResponse) => {
      setSelectedTransfer(transfer);
      setIsDetailModalOpen(true);
    },
  });

  return (
    <>
      <TableBase
        cols={cols}
        data={data}
        total={totalCount}
        loading={isLoading}
        searchOptions={opts}
        onPageIndexChange={onPageIndexChange}
      />
      {selectedTransfer && (
        <DetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedTransfer(null);
          }}
          transferData={selectedTransfer}
        />
      )}
    </>
  );
};

export default VerifyPropertyTable;
