/* eslint-disable no-nested-ternary */
import { sendGTMEvent } from "@next/third-parties/google";
import { Descriptions, Space, Tag, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { HouseIcon, ImageIcon, Trash2Icon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/button/copy-btn";
import CustomerPhoneButton from "@/lib/components/shared/Button/customer-phone";
import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import NoteModal from "@/lib/components/shared/noteModal";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { CopyApartmentUnit } from "@/lib/core/utils/actionCopy";
import apartmentUnitApi from "@/services/api/apartment/unit/apartmentUnitApi";
import { IApartmentUnitResponse } from "@/services/api/apartment/unit/IApartmentUnit";
import meApi from "@/services/api/meApi";
import { IUserLogged } from "@/types/next-auth";

const { Text } = Typography;

// const AlleyInfo = ({ record }: { record: IPropResponse }) => {
//   return (
//     <Space direction="vertical">
//       {record.PropAddress.DistanceToFont > 0 && (
//         <span>{`Cách MT: ${record.PropAddress.DistanceToFont} m`}</span>
//       )}
//       <span>{record.PropAddress.AlleyTurns} lần rẽ</span>
//       {record.PropAddress?.AlleyValues?.map((e, idx) => (
//         <Text>
//           Lần rẽ {idx + 1}: {e}m
//         </Text>
//       ))}
//     </Space>
//   );
// };

type Props = {
  savedIds: number[];
  userSession?: IUserLogged;
  //   listCompare: IPropCompare[];
  //   onCompare: (item: IPropCompare) => void;
  handleOpenQU: (id: number) => void;
  handleOpenImages: (id: number) => void;
  handleOpenVideo: (val: string) => void;
  handleOpenContact: (id: number) => void;
  handleOpenHistory: (id: number) => void;
};

const columns = ({
  savedIds,
  userSession,
  //   listCompare,
  //   onCompare,
  handleOpenImages,
  handleOpenVideo,
  handleOpenContact,
  handleOpenHistory,
}: Props): ColumnsType<IApartmentUnitResponse> => {
  const { url } = AppRoutes.apartmentUnit;

  return [
    {
      title: "Mã căn",
      dataIndex: "Code",
      align: "center",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Link href={`${url}/${record.Id}`}>
              <Text>{value}</Text>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenHistory(record.Id)}
              style={{
                color: appConst.PROP_STATUS_COLORS[record.Status - 1],
              }}
            >
              Lịch sử
            </Button>
          </Space>
        );
      },
    },
    {
      title: "Chung cư",
      dataIndex: ["Apartment", "Name"],
      render(value, record) {
        return (
          <Link href={`${url}/${record.Id}`}>
            <Space direction="vertical">
              <Text>{value}</Text>
              <Text type="secondary">{record.Apartment.DisplayAddress}</Text>
            </Space>
          </Link>
        );
      },
    },

    {
      title: "Giá",
      dataIndex: ["Contact", "DisplayPrice"],
      align: "center",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Link href={`${url}/${record.Id}`}>
              <Text>{value}</Text>
            </Link>
            {record.Note && (
              <NoteModal
                  readOnly
                title={`Mã căn: ${record?.Code}`}
                historyId={record.Id}
                tableName="tblApartmentUnit"
                value={record.Note}
                handleChange={async (note) => {
                  await apartmentUnitApi.quickUpdate({
                    Id: record?.Id,
                    Note: note ?? "",
                  });

                  mutate(apartmentUnitApi.mutateKey);
                }}
              />
            )}
          </Space>
        );
      },
    },

    {
      title: "Block / Tầng",
      dataIndex: "Zone",
      width: 200,
      render(value, record) {
        return (
          <Space direction="vertical">
            <Link href={`${url}/${record.Id}`}>
              <Descriptions size="small">
                {/* <Descriptions.Item span={3} label={'Khu vực'}>
                  {value ?? 'Không có'}
                </Descriptions.Item> */}
                <Descriptions.Item span={3} label={"Block"}>
                  {record.Block ?? "Không có"}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={"Tầng số"}>
                  {record.FloorNumber}
                </Descriptions.Item>
              </Descriptions>
            </Link>
            {(record.MainImage || record.Video) && (
              <Space>
                {record.MainImage && (
                  <Button
                    type="button"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => {
                      handleOpenImages(record.Id);
                    }}
                  >
                    <ImageIcon />
                  </Button>
                )}
                {record.Video && (
                  <Button
                    type="button"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => {
                      handleOpenVideo(record.Video?.toString() ?? "");
                    }}
                  >
                    <VideoIcon />
                  </Button>
                )}
              </Space>
            )}
          </Space>
        );
      },
    },
    {
      title: "Diện tích sử dụng",
      dataIndex: "Area",
      width: 200,
      render: (value, record) => (
        <Link href={`${url}/${record.Id}`}>
          <Descriptions size="small">
            <Descriptions.Item span={3} label={"Diện tích"}>
              <RenderArea area={value} />
            </Descriptions.Item>
            <Descriptions.Item span={3} label={"Số phòng"}>
              {record.Bedroom ?? appConst.TEXT_DEFAULT}
            </Descriptions.Item>
            <Descriptions.Item span={3} label={"Số toilet"}>
              {record.Bathroom ?? appConst.TEXT_DEFAULT}
            </Descriptions.Item>
          </Descriptions>
        </Link>
      ),
    },

    {
      title: "Loại hình",
      dataIndex: "ApartmentUnitTypeName",
      render: (value, record) => (
        <Link href={`${url}/${record.Id}`}>
          <Text>{value}</Text>
        </Link>
      ),
    },

    {
      title: "Hướng cửa",
      dataIndex: "DirectionName",
    },
    {
      title: "SĐT",
      align: "center",
      dataIndex: ["Contact", "Phone"],
      render: (value, record) => {
        if (
          record.Contact.IsHidePhone &&
          record.UserAdminId !== userSession?.Id &&
          userSession?.RoleName !== "Admin"
        )
          return <Tag>Ẩn SĐT</Tag>;

        return (
          <Tooltip title={record.Contact.TypeName}>
            <CustomerPhoneButton
              typeName={record.Contact.TypeName}
              onClick={() => handleOpenContact(record.Id)}
            />
          </Tooltip>
        );
      },
    },

    {
      key: "Action",
      title: "Thao tác",
      dataIndex: "CreatedDate",
      render: (value, record) => (
        <Space direction="vertical">
          {record.StatusName === "Chờ xoá" ? (
            [1, 2].includes(userSession?.RoleId ?? 0) && (
              <Tooltip title="Xoá">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await apartmentUnitApi.delete(record.Id);
                    mutate(apartmentUnitApi.mutateKey);
                  }}
                >
                  <Trash2Icon />
                </Button>
              </Tooltip>
            )
          ) : (
            <Space>
              <Tooltip
                title={savedIds.includes(record.Id) ? "Bỏ lưu" : "Lưu giỏ hàng"}
              >
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={async () => {
                    await meApi.toggleSaveApartmentUnit(record.Id);
                    mutate(meApi.mutateSaveApartmentUnitKey);
                    mutate(apartmentUnitApi.mutateKey);
                  }}
                >
                  <HouseIcon
                    className={
                      savedIds.includes(record.Id)
                        ? "text-blue-500 fill-blue-500"
                        : undefined
                    }
                  />
                </Button>
              </Tooltip>

              <CopyButton
                id={`btn-copy-apartment-unit-${record.Id}`}
                onCopy={() => {
                  sendGTMEvent({
                    event: "copy_apartment_unit",
                    value: record.Id,
                  });

                  navigator.clipboard.writeText(CopyApartmentUnit(record));
                }}
              />
            </Space>
          )}
          {record.Contact.NoBroker && (
            <Tag color="warning">Miễn trung gian</Tag>
          )}
        </Space>
      ),
    },
  ];
};

export default columns;
