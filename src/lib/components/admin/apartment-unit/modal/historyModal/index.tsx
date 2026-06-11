import {
  Descriptions,
  Divider,
  // Input,
  Modal,
  Space,
  Tag,
  Typography,
} from "antd";

import HistoryTree from "@/lib/components/shared/HistoryTree";
import { FormatDate } from "@/lib/core/utils/myFormat";
import { IApartmentUnitResponse } from "@/services/api/apartment/unit/IApartmentUnit";

// const { TextArea } = Input;
const { Text } = Typography;

type Props = {
  isModalOpen: boolean;
  model?: IApartmentUnitResponse;
  handleCancel: () => void;
};

const HistoryModel = ({ isModalOpen, model, handleCancel }: Props) => {
  return (
    <Modal
      title={
        <Space>
          <Tag>{`Mã: ${model?.Code}`}</Tag>
          Lịch sử bất động sản
        </Space>
      }
      // maskClosable={false}
      open={isModalOpen}
      width={600}
      footer={null}
      onCancel={() => {
        handleCancel();
        console.log(model);
      }}
    >
      <Descriptions size="small">
        <Descriptions.Item label="Người nhập" span={1.5}>
          {model?.CreatedBy}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày nhập">
          {FormatDate(model?.CreatedDate)}
        </Descriptions.Item>
      </Descriptions>
      <Divider style={{ marginTop: 5, marginBottom: 5 }} />
      <Text
        style={{
          marginTop: 10,
          marginBottom: 15,
          display: "block",
        }}
        strong
      >
        Lịch sử thay đổi
      </Text>
      {model && (
        <HistoryTree instanceId={model.Id} TableName="tblApartmentUnit" />
      )}
    </Modal>
  );
};

export default HistoryModel;
