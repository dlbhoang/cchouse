import { Button, Modal, Row, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { FormatDateTime } from "@/lib/core/utils/myFormat";
import type { INewsResponse } from "@/services/api/news/INews";

type Props = {
  isModalOpen: boolean;
  hiddenEdit?: boolean;
  model: INewsResponse;
  handleCancel: () => void;
};

const NewPreview = ({
  isModalOpen,
  hiddenEdit,
  model,
  handleCancel,
}: Props) => {
  const router = useRouter();
  console.log(model);
  return (
    <Modal
      open={isModalOpen}
      width={1400}
      onCancel={() => {
        handleCancel();
      }}
      title={
        <Row
          justify={"space-between"}
          align={"middle"}
          style={{ paddingInline: 30 }}
        >
          <Space direction="vertical">
            <Typography.Text>{model.CreatedBy}</Typography.Text>
            <Typography.Text type="secondary">
              {FormatDateTime(model.CreatedDate)}
            </Typography.Text>
          </Space>
          {!hiddenEdit && (
            <Button
              onClick={() =>
                router.push(`${AppRoutes.news.url}/edit/${model.Id}`)
              }
              type="primary"
            >
              Chỉnh sửa
            </Button>
          )}
        </Row>
      }
      centered
      style={{ top: 20 }}
      footer={null}
    >
      <div style={{ height: "80vh", paddingInline: 40, overflow: "scroll" }}>
        <div dangerouslySetInnerHTML={{ __html: model.Content }} />
      </div>
    </Modal>
  );
};

export default NewPreview;
