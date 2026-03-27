import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import FeedModalPreview from "@/lib/components/admin/feed/modal/preview";
import TableBase from "@/lib/components/shared/TableBase";
import { baseFilter } from "@/lib/core/configs/appConst";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IBaseOpts } from "@/services/api/base";
import feedApi from "@/services/api/feed/feedApi";
import type { IFeedResponse } from "@/services/api/feed/IFeed";
import type { IReportSpamResponse } from "@/services/api/reportSpam/IReportSpam";
import { columns } from "./columns";

type Props = {
  data: IReportSpamResponse[];
  totalRow: number;
  opts: IBaseOpts;
};
const ReportSpamTable = ({ data, totalRow, opts }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<IFeedResponse>();

  const cols = useMemo(() => {
    return columns({
      handlePreviewFeed: async (id) => {
        const res = await feedApi.getById(id);
        if (res.data) {
          setPreviewData(res.data);
          setOpenPreview(true);
        }
      },
    });
  }, []);

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({ ...opts, pageIndex, pageSize })}`
    );
  };

  return (
    <>
      {previewData && (
        <FeedModalPreview
          readOnly
          data={previewData}
          handleCancel={() => {
            setOpenPreview(false);
            setPreviewData(undefined);
          }}
          isModalOpen={openPreview}
          onSubmit={() => {}}
        />
      )}

      <TableBase
        cols={cols}
        data={data}
        total={totalRow}
        loading={false}
        searchOptions={baseFilter}
        onPageIndexChange={handlePageIndexChange}
      />
    </>
  );
};

export default ReportSpamTable;
