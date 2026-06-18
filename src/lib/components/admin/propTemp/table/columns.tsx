import { EyeOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";

import RenderArea from "@/lib/components/shared/CustomRender/RenderArea";
import NoteModal from "@/lib/components/shared/noteModal";
import { FormatDate } from "@/lib/core/utils/myFormat";
import { EPropTempStatus, IPropTemp } from "@/services/api/property/model";
import { IUserLogged } from "@/types/next-auth";

const { Text } = Typography;

type Props = {
  userSession?: IUserLogged;
  handlePreview: (id: number) => void;
  handleMutate: () => void;
};

const columns = ({
  userSession,
  handlePreview,
  handleMutate,
}: Props): ColumnsType<IPropTemp> => {
  return [
    {
      title: "Mã",
      dataIndex: "Id",
      align: "center",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "TransTypeName",
      render(value, record) {
        return (
          <Space direction="vertical" size={0}>
            <Text>{value}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Ngày tạo: {FormatDate(record.CreatedAt)}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "DisplayPrice",
    },
    {
      title: "Số nhà",
      // width: 100,
      dataIndex: "AddressNumber",
      render(value, record) {
        return (
          <Space direction="vertical">
            <Text>{value}</Text>
            {record.Note && (
              <NoteModal
                  readOnly
                title={`Mã BĐS: ${record?.Id}`}
                historyId={record.Id}
                value={record.Note}
                handleChange={async (note) => {}}
              />
            )}
          </Space>
        );
      },
    },
    {
      title: "Đường",
      dataIndex: "StreetName",
    },
    {
      title: "Phường / Xã",
      dataIndex: "WardName",
    },
    {
      title: "Quận / Huyện",
      dataIndex: "DistrictName",
    },
    {
      title: "Loại BĐS",
      dataIndex: "PropTypeName",
    },
    {
      title: "Loại đất",
      dataIndex: "LandTypeName",
    },
    {
      title: "Kết cấu",
      dataIndex: "Structures",
    },
    {
      title: "Diện tích",
      dataIndex: "Area",
      render(value, record) {
        return (
          <RenderArea
            title=""
            area={value}
            length={record.Length}
            width={record.Width}
          />
        );
      },
    },
    {
      title: "Vị trí",
      dataIndex: "LocationName",
    },

    {
      title: "SĐT",
      dataIndex: "CustomerPhone",
      render: (value) => (
        <Space style={{ width: 200 }}>
          <Text>{value}</Text>
        </Space>
      ),
    },

    {
      key: "Action",
      title: "Thao tác",
      dataIndex: "Status",
      render: (value, record) => (
        <Space direction="vertical">
          {[EPropTempStatus.Converted, EPropTempStatus.Duplicate].includes(
            value
          ) && (
            <Tooltip title="Xem dữ liệu">
              <Button
                icon={<EyeOutlined />}
                onClick={() => handlePreview(record.Id)}
              />
            </Tooltip>
          )}
          {/* {value === EPropTempStatus.Error && (
            <Tooltip title="Chuyển đổi">
              <Button
                icon={<SyncOutlined />}
                onClick={async () => {
                  await propTempApi.syncToPropById(record.Id);
                  mutate(propTempApi.statisticKey);
                  handleMutate();
                }}
              />
            </Tooltip>
          )} */}
        </Space>
      ),
    },
  ];
};

export default columns;
