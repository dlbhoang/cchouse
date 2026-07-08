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
  onEdit?: (item: INewsResponse) => void;
};

const NewPreview = ({
  isModalOpen,
  hiddenEdit,
  model,
  handleCancel,
  onEdit,
}: Props) => {
  const router = useRouter();

  const handleEdit = () => {
    handleCancel();
    if (onEdit) {
      onEdit(model);
      return;
    }
    router.push(`${AppRoutes.news.url}/edit/${model.Id}`);
  };

  return (
    <Modal
      open={isModalOpen}
      width={1400}
      onCancel={handleCancel}
      title={
        <Row
          justify={"space-between"}
          align={"middle"}
          style={{ paddingInline: 30 }}
        >
          <Space direction="vertical" size={2}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {model.Title || "Xem tin"}
            </Typography.Title>
            <Typography.Text type="secondary">
              {FormatDateTime(model.CreatedDate)} • {model.StatusName || ""}
            </Typography.Text>
            {model.ApprovedBy && (
              <Typography.Text type="secondary">
                Người duyệt: {model.ApprovedBy}
                {model.ApprovedDate ? ` • ${FormatDateTime(model.ApprovedDate)}` : ""}
              </Typography.Text>
            )}
          </Space>
          {!hiddenEdit && (
            <Button onClick={handleEdit} type="primary">
              Chỉnh sửa
            </Button>
          )}
        </Row>
      }
      centered
      style={{ top: 20 }}
      footer={null}
    >
      <div style={{ height: "80vh", paddingInline: 40, overflow: "auto" }}>
        <div dangerouslySetInnerHTML={{ __html: model.Content ?? "" }} />
      </div>
    </Modal>
  );
};

export default NewPreview;
