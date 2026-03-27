import { Col, Row, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import { openVideoModal } from "@/lib/components/shared/MyModal/Video";
import TableBase from "@/lib/components/shared/TableBase";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import apartmentUnitApi from "@/services/api/apartment/unit/apartmentUnitApi";
import {
  IApartmentUnitOpts,
  IApartmentUnitResponse,
} from "@/services/api/apartment/unit/IApartmentUnit";
import meApi from "@/services/api/meApi";
import { fileServices } from "@/services/api/services/fileServices";
import ContactModal from "../modal/contactModal";
import HistoryModel from "../modal/historyModal";
import columns from "./columns";

type Props = {
  opts: IApartmentUnitOpts;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
};
export const ApartmentUnitTable = ({ opts, onPageIndexChange }: Props) => {
  const { data, isLoading, isValidating, mutate } =
    apartmentUnitApi.useGet(opts);

  const { data: session } = useSession();
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [images, setImages] = useState<IMyUploadFile[]>([]);
  const [openImages, setOpenImages] = useState<boolean>(false);
  const [selectedData, setSeletedData] = useState<IApartmentUnitResponse>();
  const [openContact, setOpenContact] = useState<boolean>(false);
  const [openHistory, setOpenHistory] = useState<boolean>(false);

  const { data: saveData } = meApi.useGetSaveApartmentUnits();

  const cols: ColumnsType<IApartmentUnitResponse> = columns({
    savedIds: saveData?.data.map((e) => e.Id) ?? [],
    userSession: session?.user,
    // listCompare,
    // onCompare: toggleCompare,
    // handleShowWebsite: (id: number) =>
    //   router.push(`${AppRoutes.property.url}/propPreview/${id}`),
    handleOpenImages: async (id: number) => {
      const result = await apartmentUnitApi.images(id, {
        IsDeleted: false,
      });
      setImages(fileServices.mapFromFileUpload(result.data));
      setOpenImages(true);
    },
    handleOpenQU: (id: number) => {
      // setOpenQU(true);
      setSeletedData(data?.data?.find((x) => x.Id === id));
    },

    handleOpenVideo(val) {
      openVideoModal(isMobile, val);
    },
    handleOpenContact: (id: number) => {
      setOpenContact(true);
      setSeletedData(data?.data?.find((x) => x.Id === id));
    },
    handleOpenHistory: (id: number) => {
      setOpenHistory(true);
      setSeletedData(data?.data?.find((x) => x.Id === id));
    },
  });
  const handleContactCancel = () => {
    setOpenContact(false);
    setSeletedData(undefined);
  };
  const handleHistoryCancel = () => {
    setOpenHistory(false);
  };

  useEffect(() => {
    if (data !== undefined) {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts]);

  return (
    <>
      <Row justify="space-between" gutter={[12, 12]}>
        <Col>
          Tìm được{" "}
          <Typography.Text strong>{data?.totalRow || 0}</Typography.Text> kết
          quả
        </Col>
      </Row>

      <TableBase
        loading={isLoading || isValidating}
        total={data?.totalRow}
        searchOptions={opts}
        data={data?.data || []}
        cols={cols as any}
        bordered
        onPageIndexChange={onPageIndexChange}
      />

      {selectedData && (
        <>
          <ContactModal
            isModalOpen={openContact}
            handleCancel={handleContactCancel}
            model={selectedData}
          />
          <HistoryModel
            isModalOpen={openHistory}
            handleCancel={handleHistoryCancel}
            model={selectedData}
          />
        </>
      )}

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
