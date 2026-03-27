"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { reportRoutes } from "@/constants/routes/report-routes";
import FeedModalPreview from "@/lib/components/admin/feed/modal/preview";
import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import {
  objToQueryString,
  objToQueryStringWithArray,
} from "@/lib/core/utils/app-func";
import type { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import { axiosClient } from "@/services/api/api_config";
import feedApi from "@/services/api/feed/feedApi";
import type { IFeedResponse } from "@/services/api/feed/IFeed";
import type { IFeedReport } from "../types/feed-report";
import type { IFeedReportQuery } from "../types/report-query";
import type { IReportResponse } from "../types/report-response";
import columns from "./columns";

type Props = {
  query: IFeedReportQuery;
};

const FeedViewTable = ({ query }: Props) => {
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<IFeedResponse>();

  const { data: summary, isLoading } = useSWR(
    `${reportRoutes.getTopViewedFeedSummary}?${objToQueryString(query)}`,
    (route) => axiosClient.get<any, IApiResponse<IReportResponse[]>>(route),
    { revalidateOnFocus: false }
  );

  const topIds = useMemo(() => {
    if (!summary?.data || summary?.data?.length === 0) return undefined;

    return summary.data.map((x) => x.GroupKey);
  }, [summary]);

  const { data: details, isLoading: isLoadingDetails } = useSWR(
    `${reportRoutes.getTopViewedFeedDetails}?${objToQueryStringWithArray({
      ...query,
      TopIds: topIds,
    })}`,
    (route) => axiosClient.get<any, IApiResponse<IFeedReport[]>>(route),
    { revalidateOnFocus: false }
  );

  const cols = useMemo(
    () =>
      columns({
        onPreview: async (feedId) => {
          setOpenPreview(true);
          const res = await feedApi.getById(feedId);
          setPreviewData(res.data);
        },
      }),
    []
  );

  return (
    <>
      <TableNoPaging
        loading={isLoading || isLoadingDetails}
        data={details?.data ?? []}
        cols={cols}
      />

      {previewData && (
        <FeedModalPreview
          showEdit={false}
          data={previewData}
          handleCancel={() => {
            setOpenPreview(false);
            setPreviewData(undefined);
          }}
          isModalOpen={openPreview}
          onSubmit={() => {}}
        />
      )}
    </>
  );
};

export default FeedViewTable;
