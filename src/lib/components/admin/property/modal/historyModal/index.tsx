import {
  Descriptions,
  Divider,
  // Input,
  Modal,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import {} from "react";

import HistoryTree from "@/lib/components/shared/HistoryTree";
import { FormatDate } from "@/lib/core/utils/myFormat";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";

const { useToken } = theme;
const { Text, Paragraph } = Typography;

type Props = {
  isModalOpen: boolean;
  model?: IPropResponse;
  handleCancel: () => void;
};

const HistoryModel = ({ isModalOpen, model, handleCancel }: Props) => {
  // const [oldData, setOldData] = useState<IHistoryOld[]>([]);

  // useEffect(() => {
  //   const fetch = async () => {
  //     const res = await historyApi.getOld({
  //       pageIndex: 1,
  //       pageSize: 100,
  //       InstanceId: model?.Id,
  //     });
  //     setOldData(res.data);
  //   };
  //   fetch();
  // }, [model?.Id]);
  // const { token } = useToken();

  // const ellipsis = { rows: 2, expandable: true, symbol: 'Xem thêm' };

  return (
    <Modal
      title={
        <Space>
          <Tag>{`Mã: ${model?.Id}`}</Tag>
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
        <HistoryTree
          instanceId={model.Id}
          tableName="tblProp"
          oldTableName="tblProperty"
        />
      )}
      {/* <Divider />
        <Text
          style={{
            marginTop: 10,
            marginBottom: 15,
            display: 'block',
          }}
          strong
        >
          Lịch sử cũ
        </Text>
        <div style={{ maxHeight: 500, overflow: 'auto', padding: 10 }}>
          <Timeline>
            {oldData.map((item) => (
              <Timeline.Item key={item.Id}>
                <Row
                  style={{ borderBlockEnd: `1px solid ${token.colorPrimary}` }}
                  gutter={[12, 12]}
                  justify="space-between"
                >
                  <Col>
                    <Text>{FormatDateTime(item.UpdatedDate)}</Text>
                  </Col>
                  <Col>
                    <Text>{item.UpdatedBy}</Text>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col>
                    <div dangerouslySetInnerHTML={{ __html: item.Content }} />
                    <div dangerouslySetInnerHTML={{ __html: item.Note }} />
                  </Col>
                </Row>
              </Timeline.Item>
            ))}
          </Timeline>
        </div> */}
    </Modal>
  );
};

export default HistoryModel;
