/* eslint-disable no-nested-ternary */
import { sendGTMEvent } from "@next/third-parties/google";
import { Avatar, Space, Tag, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import {
  CopyIcon,
  ImageIcon,
  ShoppingCartIcon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/button/copy-btn";
import CustomerPhoneButton from "@/lib/components/shared/Button/customer-phone";
import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import NoteModal from "@/lib/components/shared/noteModal";
import { appConst } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import { CopyProp } from "@/lib/core/utils/actionCopy";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import { IPropCompare } from "@/lib/interfaces/Property/IPropCompare";
import propertyApi from "@/services/api/property/propertyApi";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";
import { IUserLogged } from "@/types/next-auth";

const { Text } = Typography;

const AlleyInfo = ({ record }: { record: IPropResponse }) => {
  return (
    <Space direction="vertical">
      {record.PropAddress.DistanceToFont > 0 && (
        <span>{`Cách MT: ${record.PropAddress.DistanceToFont} m`}</span>
      )}
      <span>{record.PropAddress.AlleyTurns} lần rẽ</span>
      {record.PropAddress?.AlleyValues?.map((e, idx) => (
        <Text key={idx.toString()}>
          Lần rẽ {idx + 1}: {e}m
        </Text>
      ))}
    </Space>
  );
};

type Props = {
  userSession?: IUserLogged;
  listCompare: IPropCompare[];
  onCompare: (item: IPropCompare) => void;
  handleOpenQU: (id: number) => void;
  handleOpenPreview: (id: number) => void;
  handleOpenImages: (id: number) => void;
  handleOpenVideo: (val: string) => void;
  handleOpenContact: (id: number) => void;
  handleOpenHistory: (id: number) => void;
};

const columns = ({
  userSession,
  listCompare,
  onCompare,
  handleOpenImages,
  handleOpenVideo,
  handleOpenContact,
  handleOpenHistory,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props): ColumnsType<IPropResponse> => {
  const { url } = AppRoutes.property;

  return [
    {
      title: "Mã",
      dataIndex: "Id",
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
      title: "Giá",
      dataIndex: "DisplayPrice",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Link href={`${url}/${record.Id}`}>
              <Text style={{ whiteSpace: "nowrap" }}>{value}</Text>
            </Link>
            <Text
              type="secondary"
              style={{ fontSize: 12, whiteSpace: "nowrap" }}
            >
              {record?.PricePerSquareMeter}
            </Text>
            {record.IsMonopoly && <Tag color="orange">Độc quyền</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Số nhà",
      // width: 100,
      dataIndex: ["PropAddress", "AddressNumber"],
      render(value, record) {
        const { LandNumber, MapNumber } = record.PropAddress;
        return (
          <Space direction="vertical">
            {LandNumber ? (
              <Link href={`${url}/${record.Id}`}>
                <Text
                  style={{ whiteSpace: "nowrap" }}
                >{`Thửa đất: ${LandNumber}`}</Text>
                <br />
                <Text style={{ whiteSpace: "nowrap" }}>
                  {`Tờ bản đồ: ${MapNumber}`}
                </Text>
              </Link>
            ) : (
              <Link href={`${url}/${record.Id}`}>
                <Text style={{ whiteSpace: "nowrap" }}>{`${
                  record.PropAddress.AddressNumber
                } ${
                  record.PropAddress.SubAddressName
                    ? `(${record.PropAddress.SubAddressName})`
                    : ""
                }`}</Text>
                <br />
                {record.PropAddress.OldAddressNumber && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Số cũ: {record.PropAddress.OldAddressNumber}
                  </Text>
                )}
              </Link>
            )}
            {record.Note && (
              <NoteModal
                title={`Mã BĐS: ${record?.Id}`}
                historyId={record.Id}
                value={record.Note}
                handleChange={async (note) => {
                  await propertyApi.quickUpdate({
                    Id: record?.Id,
                    Note: note ?? "",
                  });

                  mutate(propertyApi.mutateKey);
                }}
              />
            )}
          </Space>
        );
      },
    },
    {
      title: "Đường",
      dataIndex: ["PropAddress", "StreetName"],
      render: (value, record) => (
        <Link href={`${url}/${record.Id}`}>
          <Space direction="vertical">
            <Text>{value}</Text>
            {record.PropAddress.OldStreetName && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({record.PropAddress.OldStreetName})
              </Text>
            )}
            {/* {record.CustomerTypeName === 'Đấu giá' && (
              <Tag color="orange">Đấu giá</Tag>
            )} */}
          </Space>
        </Link>
      ),
    },
    {
      title: "Phường / Xã",
      dataIndex: ["PropAddress", "WardName"],
      render: (value, record) => (
        <Link href={`${url}/${record.Id}`}>
          <Text>{value}</Text>
          <br />
          {record.PropAddress.OldWardName &&
            record.PropAddress.WardId !== record.PropAddress.OldWardId && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({record.PropAddress.OldWardName})
              </Text>
            )}
        </Link>
      ),
    },
    {
      title: "Quận / Huyện",
      dataIndex: ["PropAddress", "DistrictName"],
      render: (value, record) => (
        <Link href={`${url}/${record.Id}`}>
          <Text>{value}</Text>
          <br />
          {record.PropAddress.OldDistrictName &&
            record.PropAddress.DistrictId !==
              record.PropAddress.OldDistrictId && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({record.PropAddress.OldDistrictName})
              </Text>
            )}
        </Link>
      ),
    },
    {
      title: "Loại BĐS",
      dataIndex: ["PropAddress", "PropTypeName"],
      render: (value, record) => (
        <Link href={`${url}/${record.Id}`}>
          <Space direction="vertical">
            <Text>{value}</Text>
            {record.PropAddress?.PropName && (
              <Tag color="processing">{record.PropAddress?.PropName}</Tag>
            )}
          </Space>{" "}
        </Link>
      ),
    },
    {
      title: "Kết cấu",
      dataIndex: "CustomDisplayStructures",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Link href={`${url}/${record.Id}`}>
              <Text>{value?.toString()}</Text>
            </Link>
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
                    handleOpenVideo(record.Video);
                  }}
                >
                  <VideoIcon />
                </Button>
              )}
            </Space>
          </Space>
        );
      },
    },
    {
      title: "Diện tích",
      dataIndex: "Area",
      render(value, record) {
        return (
          <Space direction="vertical">
            <RenderArea
              title="DTTT: "
              area={value}
              length={record.Length}
              width={record.Width}
              backSide={record.BackSide}
            />
            {record.PropAddress.AreaLegal > 0 &&
              record.TransType === ETransType.sell && (
                <RenderArea
                  title="DTCN: "
                  area={record.PropAddress.AreaLegal}
                  length={record.PropAddress.LengthLegal}
                  width={record.PropAddress.WidthLegal}
                  backSide={record.PropAddress.BackSideLegal}
                />
              )}
            {record.FloorArea > 0 && (
              <RenderArea title="DT sàn: " area={record.FloorArea} />
            )}
          </Space>
        );
      },
    },
    {
      title: "Vị trí",
      dataIndex: ["PropAddress", "LocationName"],
      render(value, record) {
        return (
          <Link href={`${url}/${record.Id}`}>
            <Space direction="vertical">
              <Text>
                {value} {record.PropAddress.IsOneWay && "(1 chiều)"}{" "}
                {record.PropAddress.AlleyTurns === 1 &&
                  record.PropAddress.AlleyValues?.length === 1 &&
                  `${record.PropAddress.AlleyValues[0] ?? 0}m`}
              </Text>
              {record.PropAddress.StreetWidth > 0 && (
                <Text>Độ rộng: {record.PropAddress.StreetWidth} m</Text>
              )}
              {record.PropAddress.AlleyTurns > 1 && (
                <AlleyInfo record={record} />
              )}
              {record.PropAddress.LocationFeatureName && (
                <Tag color="success">
                  {record.PropAddress.LocationFeatureName}
                </Tag>
              )}
            </Space>
          </Link>
        );
      },
    },
    {
      title: "Hướng",
      dataIndex: ["PropAddress", "DirectionName"],
    },
    {
      title: "SĐT",
      align: "center",
      render: (value, record) => {
        const logo = record.CustomerLogo ? (
          <Avatar src={record.CustomerLogo?.toString()} size={"small"} />
        ) : undefined;
        return record.IsHidePhone &&
          record.UserAdminId !== userSession?.Id &&
          userSession?.RoleName !== "Admin" ? (
          <Tag>Ẩn SĐT</Tag>
        ) : (
          <Tooltip title={record.CustomerTypeName}>
            <Space direction="vertical">
              <CustomerPhoneButton
                typeName={record.CustomerTypeName}
                icon={logo}
                onClick={() => handleOpenContact(record.Id)}
              />

              {record.IsHidePhone && <Tag>Ẩn SĐT</Tag>}
            </Space>
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
                    await propertyApi.delete(record.Id);
                    mutate(propertyApi.mutateKey);
                  }}
                >
                  <Trash2Icon />
                </Button>
              </Tooltip>
            )
          ) : (
            <Space>
              <Tooltip title={record.IsSaved ? "Bỏ lưu" : "Lưu giỏ hàng"}>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={async () => {
                    await userAdminApi.toggleSaveProp(record.Id);
                    mutate(propertyApi.mutateKey);
                    mutate(userAdminApi.mutateSavePropsKey);
                  }}
                >
                  <ShoppingCartIcon
                    className={
                      record.IsSaved ? "text-blue-500 fill-blue-500" : undefined
                    }
                  />
                </Button>
              </Tooltip>
              <Tooltip
                title={
                  listCompare.some((x) => x.Id === record.Id)
                    ? "Bỏ lưu"
                    : "Lưu so sánh"
                }
              >
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={async () => {
                    onCompare({
                      Id: record.Id,
                      Image: record.MainImage
                        ? record.MainImage.Path
                        : "/home.jpg",
                      DisplayPrice: record.DisplayPrice,
                      DisplayAddress: record.PropAddress.DisplayAddress,
                    });
                  }}
                >
                  <CopyIcon
                    className={
                      listCompare.some((x) => x.Id === record.Id)
                        ? "text-blue-500 fill-blue-500"
                        : undefined
                    }
                  />
                </Button>
              </Tooltip>

              <CopyButton
                id={`btn-copy-property-${record.Id}`}
                onCopy={() => {
                  sendGTMEvent({
                    event: "copy_property",
                    value: record.Id,
                  });

                  navigator.clipboard.writeText(CopyProp(record));
                }}
              />
            </Space>
          )}
          {record.NoBroker && <Tag color="warning">Miễn trung gian</Tag>}
        </Space>
      ),
    },
  ];
};

export default columns;
