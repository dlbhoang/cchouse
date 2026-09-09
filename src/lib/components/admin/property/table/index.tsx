import { ColumnsType } from "antd/lib/table";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ImagesPreview from "@/lib/components/shared/ImagesPreview";
import { openVideoModal } from "@/lib/components/shared/MyModal/Video";
import TableBase from "@/lib/components/shared/TableBase";
import { ETableName } from "@/lib/core/enum";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { usePropStore } from "@/lib/stored/PropStored";
import imagesApi from "@/services/api/imagesApi";
import propertyApi from "@/services/api/property/propertyApi";
import { fileServices } from "@/services/api/services/fileServices";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";
import ContactModal from "../modal/contactModal";
import HistoryModel from "../modal/historyModal";
import columns from "./columns";
import "./property-table.css";

type Props = {
  isPropCart?: boolean;
  searchOptions: IPropAdminOpts;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
  onOpenDetail?: (id: number) => void;
  onOpenAdd?: (opts?: {
    transType?: number;
    query?: {
      AddressNumber?: string;
      ProvinceId?: string;
      DistrictId?: string;
      WardId?: string;
      StreetId?: string;
    };
  }) => void;
  /** Reports the current result total up to a parent (e.g. the page header). */
  onTotalChange?: (total: number) => void;
};
export const PropertyTable = ({
  isPropCart,
  searchOptions,
  onPageIndexChange,
  onOpenDetail,
  onOpenAdd,
  onTotalChange,
}: Props) => {
  const { data, isLoading, isValidating, mutate } =
    isPropCart === true
      ? userAdminApi.useGetSaveProps(searchOptions.UserAdminId ?? 0)
      : propertyApi.useGet(searchOptions);

  const { data: session } = useSession();
  const { listCompare, toggleCompare } = usePropStore();
  const isMobile = useMediaQuery({ query: "(max-width: 760px)" });
  const [images, setImages] = useState<IMyUploadFile[]>([]);
  const [openImages, setOpenImages] = useState<boolean>(false);
  const [selectedData, setSeletedData] = useState<IPropResponse>();
  const [openContact, setOpenContact] = useState<boolean>(false);
  const [openHistory, setOpenHistory] = useState<boolean>(false);

  const cols: ColumnsType<IPropResponse> = columns({
    userSession: session?.user,
    listCompare,
    onCompare: toggleCompare,
    // handleShowWebsite: (id: number) =>
    //   router.push(`${AppRoutes.property.url}/propPreview/${id}`),
    handleOpenImages: async (id: number) => {
      const result = await imagesApi.get({
        ContentId: id,
        TableName: ETableName.Property,
      });
      setImages(fileServices.mapFromFileUpload(result.data));
      setOpenImages(true);
    },
    handleOpenQU: (id: number) => {
      // setOpenQU(true);
      setSeletedData(data?.data?.find((x) => x.Id === id));
    },
    handleOpenPreview: (id: number) => {
      // setOpenPreview(true);
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
    handleOpenDetail: (id: number) => {
      onOpenDetail?.(id);
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
  }, [searchOptions]);

  useEffect(() => {
    const total = isPropCart
      ? data?.data?.filter((x) => x.TransType === searchOptions.TransType)
          ?.length
      : data?.totalRow;
    onTotalChange?.(total || 0);
  }, [data, isPropCart, searchOptions.TransType]);

  return (
    <>
      <div className="property-table-shell">
        {isPropCart ? (
          <TableBase
            loading={isLoading || isValidating}
            total={data?.data.length || 0}
            searchOptions={searchOptions}
            data={
              data?.data.filter((x) => x.TransType === searchOptions.TransType) ||
              []
            }
            cols={cols}
            bordered
            useCustomPagination
            onPageIndexChange={onPageIndexChange}
          />
        ) : (
          <TableBase
            loading={isLoading || isValidating}
            total={data?.totalRow || 0}
            searchOptions={searchOptions}
            data={data?.data || []}
            cols={cols}
            bordered
            useCustomPagination
            onPageIndexChange={onPageIndexChange}
          />
        )}
      </div>

      {selectedData && (
        <>
          <ContactModal
            isModalOpen={openContact}
            handleCancel={handleContactCancel}
            model={selectedData}
            onOpenDetail={onOpenDetail}
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