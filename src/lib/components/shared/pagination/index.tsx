import { Pagination } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { baseFilter } from "@/lib/core/configs/appConst";
import { objToQueryString } from "@/lib/core/utils/app-func";

const AppPagination = ({ total }: { total: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const onDefPageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({
        ...Object.fromEntries(query?.entries() ?? []),
        pageIndex,
        pageSize,
      })}`
    );
  };

  if (total === 0) return null;

  return (
    <Pagination
      defaultCurrent={1}
      total={total}
      pageSizeOptions={["10", "20", "30", "40", "50"]}
      pageSize={Number(query?.get("pageSize") || baseFilter.pageSize)}
      current={Number(query?.get("pageIndex") || 1)}
      showSizeChanger
      onChange={onDefPageIndexChange}
      showTitle
    />
  );
};

export default AppPagination;
