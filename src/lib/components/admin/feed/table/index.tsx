import { ColumnsType } from "antd/lib/table";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { mutate } from "swr";

import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import { openVideoModal } from "@/lib/components/shared/MyModal/Video";
import TableBase from "@/lib/components/shared/TableBase";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { IFeedFilter } from "@/lib/interfaces/filter/ISearchOptions";
import feedApi from "@/services/api/feed/feedApi";
import { IFeedResponse } from "@/services/api/feed/IFeed";
import { fileServices } from "@/services/api/services/fileServices";
import FeedModalPreview from "../modal/preview";
import columns from "./columns";

type Props = {
  data: IFeedResponse[];
  total: number;
  loading: boolean;
  searchOptions: IFeedFilter;
  onPageIndexChange?: (pageIndex: number, pageSize: number) => void;
};

const FeedTable = ({
  data,
  total,
  loading,
  searchOptions,
  onPageIndexChange,
}: Props) => {
  const [images, setImages] = useState<IMyUploadFile[]>([]);

  const [openImages, setOpenImages] = useState<boolean>(false);
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<IFeedResponse>();
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const cols: ColumnsType<IFeedResponse> = columns({
    handleOpenPreview: (item: IFeedResponse) => {
      setOpenPreview(true);
      setPreviewData(item);
    },
    handleOpenImages: (values: string[]) => {
      setOpenImages(true);
      console.log(values);

      setImages(fileServices.mapFromString(values) ?? []);
    },

    handleOpenVideo(val) {
      openVideoModal(isMobile, val);
    },
  });

  return (
    <>
      <TableBase
        loading={loading}
        total={total}
        searchOptions={searchOptions}
        data={data}
        cols={
          searchOptions.Status?.toString() === "0"
            ? cols.filter((x) => x.key !== "AcceptDate")
            : cols
        }
        // defaultSelectRow={[1]}
        // onSelect={onSelect}
        onPageIndexChange={onPageIndexChange}
      />

      <ImagesPreview
        isPreviewVisible={openImages}
        onPreviewVisible={setOpenImages}
        hidden
        imgWidth={30}
        images={images}
      />

      {previewData && (
        <FeedModalPreview
          showEdit={true}
          data={previewData}
          handleCancel={() => {
            setOpenPreview(false);
            setPreviewData(undefined);
            mutate((key) => {
              if (typeof key === "string" && key.startsWith(feedApi.mutateKey))
                return true;
              return false;
            });
          }}
          isModalOpen={openPreview}
          onSubmit={() => {}}
        />
      )}
    </>
  );
};

export default FeedTable;
