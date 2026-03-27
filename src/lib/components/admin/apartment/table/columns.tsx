import { Button, Space, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SquarePenIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { mutate } from "swr";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import apartmentApi from "@/services/api/apartment/apartmentApi";
import { IApartmentResponse } from "@/services/api/apartment/IApartment";

const { Text } = Typography;

type Props = {
  handleRequestModal: (item: IApartmentResponse) => void;
};

const columns = ({
  handleRequestModal,
}: Props): ColumnsType<IApartmentResponse> => {
  const url = `${AppRoutes.apartment.url}`;
  return [
    {
      title: "STT",
      dataIndex: "Id",
      align: "center",
      render(value) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: "Tên chung cư / căn hộ",
      dataIndex: "Name",
      render(value) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: "Số nhà",
      dataIndex: "AddressNumber",
      render(value) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: "Đường",
      dataIndex: "StreetName",
      render(value) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: "Phường / Xã",
      dataIndex: "WardName",
      render(value) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
          </Space>
        );
      },
    },
    {
      title: "Quận / Huyện",
      dataIndex: "DistrictName",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Link href={`${url}/${record.Id}`}>
              <Text>{value}</Text>
            </Link>
          </Space>
        );
      },
    },
    {
      title: "Diện tích ",
      dataIndex: "Area",
      render: (value, record) => <RenderArea area={value} />,
    },
    {
      key: "action",
      title: "Thao tác",
      render: (value, record) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => handleRequestModal(record)}
              icon={<SquarePenIcon className="size-4" />}
            />
            <BtnConfirm
              type="icon"
              btnType="link"
              icon={<Trash2Icon className="size-4" />}
              onOkClick={async () => {
                await apartmentApi.delete(record.Id ?? 0);
                mutate(apartmentApi.mutateKey);
              }}
            />
          </Space>
        );
      },
    },
  ];
};

export default columns;
