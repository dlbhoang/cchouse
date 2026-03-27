import { useSession } from "next-auth/react";
import TableBase from "@/lib/components/shared/TableBase";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import type { IImageCloud } from "@/services/api/image-cloud/model";
import columns from "./columns";

type Props = {
  data: IImageCloud[];
  total: number;
  loading: boolean;
  searchOptions: ISearchOptions;

  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
  // onSelect: (val: IUserAdminV1Response) => void;
  handleRequestModal: (item: IImageCloud) => void;
  handleMutate: () => void;
};

const ImageCloudTable = ({
  data,
  total,
  loading,
  searchOptions,
  onPageIndexChange,
  handleRequestModal,
  handleMutate,
}: Props) => {
  const { data: session } = useSession();

  return (
    <TableBase
      loading={loading}
      total={total}
      searchOptions={searchOptions}
      data={data}
      cols={columns}
      tableLayout="fixed"
      // defaultSelectRow={[1]}
      // onSelect={onSelect}
      onPageIndexChange={onPageIndexChange}
    />
  );
};

export default ImageCloudTable;
