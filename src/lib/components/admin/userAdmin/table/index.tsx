/* eslint-disable no-nested-ternary */
import { useState } from "react";

import TableBase from "@/lib/components/shared/TableBase";
import { IUserAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";
import { IUserAdminResponse } from "@/services/api/userAdmin/IUserAdmin";
import QuickUpdateModal from "../modal/quickUpdate";
import PendingReviewModal from "../modal/pending-review";

import { columns } from "./columns";

type Props = {
  data: IUserAdminResponse[];
  total: number;
  loading: boolean;
  searchOptions: IUserAdminOpts;

  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
  handleMutate: () => void;
  onRejected: () => void;
  // onSelect: (val: IUserAdminV1Response) => void;
};

const UserAdminTable = ({
  data,
  total,
  loading,
  searchOptions,
  onPageIndexChange,
  handleMutate,
  onRejected,
}: Props) => {
  const { districts } = useAdminContext();
  const [openQU, setOpenQU] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<IUserAdminResponse>();
  const [reviewData, setReviewData] = useState<IUserAdminResponse>();

  return (
    <>
      <TableBase
        loading={loading}
        total={total}
        searchOptions={searchOptions}
        data={data}
        cols={columns({
          districtLength: districts.length,
          status: searchOptions.Status,
          onEdit: (item) => {
            setSelectedData(item);
            setOpenQU(true);
          },
          onReview: setReviewData,
        })}
        // defaultSelectRow={[1]}
        // onSelect={onSelect}
        onPageIndexChange={onPageIndexChange}
      />

      {selectedData && (
        <QuickUpdateModal
          handleMutate={handleMutate}
          isModalOpen={openQU}
          model={selectedData}
          handleCancel={() => setOpenQU(false)}
        />
      )}
      <PendingReviewModal
        model={reviewData}
        open={!!reviewData}
        onClose={() => setReviewData(undefined)}
        onCompleted={handleMutate}
        onRejected={onRejected}
      />
    </>
  );
};

export default UserAdminTable;
