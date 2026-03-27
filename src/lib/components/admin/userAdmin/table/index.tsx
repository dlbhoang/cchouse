/* eslint-disable no-nested-ternary */
import { Typography } from "antd";
import { useState } from "react";

import TableBase from "@/lib/components/shared/TableBase";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";
import { IUserAdminResponse } from "@/services/api/userAdmin/IUserAdmin";
import QuickUpdateModal from "../modal/quickUpdate";

import { columns } from "./columns";

const { Text } = Typography;
type Props = {
  data: IUserAdminResponse[];
  total: number;
  loading: boolean;
  searchOptions: ISearchOptions;

  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
  handleMutate: () => void;
  // onSelect: (val: IUserAdminV1Response) => void;
};

const UserAdminTable = ({
  data,
  total,
  loading,
  searchOptions,
  onPageIndexChange,
  handleMutate,
}: Props) => {
  const { districts } = useAdminContext();
  const [openQU, setOpenQU] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<IUserAdminResponse>();

  return (
    <>
      <TableBase
        loading={loading}
        total={total}
        searchOptions={searchOptions}
        data={data}
        cols={columns({
          districtLength: districts.length,
          onEdit: (item) => {
            setSelectedData(item);
            setOpenQU(true);
          },
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
    </>
  );
};

export default UserAdminTable;
