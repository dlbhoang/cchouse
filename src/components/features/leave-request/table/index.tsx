import TableBase from "@/lib/components/shared/TableBase";
import columns from "./columns";
import DetailModal from "../detail-modal";
import { useState } from "react";
import { ILeaveResponse } from "../types/leave-response";
import { ILeaveQuery } from "../types/leave-query";
import LeaveRequestEdit from "../edit";

type Props = {
  data: ILeaveResponse[];
  isLoading: boolean;
  totalCount: number;
  opts: ILeaveQuery;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
};

const LeaveRequestTable = ({
  data,
  isLoading,
  totalCount,
  opts,
  onPageIndexChange,
}: Props) => {
  const [selectedItem, setSelectedItem] = useState<ILeaveResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const cols = columns({
    onDetail: (item: ILeaveResponse) => {
      setSelectedItem(item);
      setIsDetailModalOpen(true);
    },
    onEdit: (item: ILeaveResponse) => {
      setSelectedItem(item);
      setIsEditModalOpen(true);
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
      {selectedItem && (
        <DetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
        />
      )}
      {selectedItem && (
        <LeaveRequestEdit
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          item={selectedItem}
        />
      )}
    </>
  );
};

export default LeaveRequestTable;
