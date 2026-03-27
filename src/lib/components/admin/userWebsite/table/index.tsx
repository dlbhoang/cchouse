import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { mutate } from "swr";
import TableBase from "@/lib/components/shared/TableBase";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import type { IUserWebsiteResponse } from "@/services/api/userWebsite/model";
import userWebsiteApi from "@/services/api/userWebsite/userWebsiteApi";
import { columns } from "./columns";

type Props = {
  data: IUserWebsiteResponse[];
  total: number;
  loading: boolean;
  searchOptions: ISearchOptions;
};
const UserWebsiteTable = ({ data, total, loading, searchOptions }: Props) => {
  const pathname = usePathname();
  const query = useSearchParams();

  const cols = useMemo(
    () =>
      columns({
        onBlock: async (id: number) => {
          await userWebsiteApi.block(id);
          mutate(
            `${pathname}?${objToQueryString(
              Object.fromEntries(query?.entries() ?? [])
            )}`
          );
        },
      }),
    []
  );

  return (
    <TableBase
      loading={loading}
      total={total}
      searchOptions={searchOptions}
      data={data}
      cols={cols}
    />
  );
};

export default UserWebsiteTable;
