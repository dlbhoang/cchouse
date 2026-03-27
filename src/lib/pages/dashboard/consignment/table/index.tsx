import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import { openVideoModal } from "@/lib/components/shared/MyModal/Video";
import TableBase from "@/lib/components/shared/TableBase";
import { baseFilter } from "@/lib/core/configs/appConst";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { useAdminContext } from "@/lib/stored";
import type { IBaseOpts } from "@/services/api/base";
import type { IConsignmentResponse } from "@/services/api/consignment/IConsignment";
import { fileServices } from "@/services/api/services/fileServices";
import { columns } from "./columns";

type Props = {
  data: IConsignmentResponse[];
  totalRow: number;
  opts: IBaseOpts;
};
const ConsignmentTable = ({ data, totalRow, opts }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { smallScreen } = useAdminContext();
  const [images, setImages] = useState<IMyUploadFile[]>([]);
  const [openImages, setOpenImages] = useState<boolean>(false);

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({ ...opts, pageIndex, pageSize })}`
    );
  };

  const cols = columns({
    handleOpenImages: (val: string[]) => {
      setImages(fileServices.mapFromString(val) ?? []);
      setOpenImages(true);
    },
    handleOpenVideo(val) {
      openVideoModal(smallScreen, val);
    },
  });

  return (
    <>
      <TableBase
        cols={cols}
        data={data}
        total={totalRow}
        loading={false}
        searchOptions={baseFilter}
        onPageIndexChange={handlePageIndexChange}
      />
      <ImagesPreview
        isPreviewVisible={openImages}
        onPreviewVisible={setOpenImages}
        hidden
        imgWidth={30}
        images={images}
      />
    </>
  );
};

export default ConsignmentTable;
