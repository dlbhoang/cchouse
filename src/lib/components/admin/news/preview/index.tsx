import { Button, Modal, Space, Divider, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
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

  const labelStyle: React.CSSProperties = {
    color: "var(--Text-Main, #0A0A0A)",
    fontFamily: "var(--Font-family-Text, Inter)",
    fontSize: "var(--Font-sizes-text-xs, 12px)",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "var(--Line-height-text-xs, 16px)",
  };

  const valueStyle: React.CSSProperties = {
    color: "var(--Text-Subtle, #A1A1AA)",
    fontFamily: "var(--Font-family-Text, Inter)",
    fontSize: "var(--Font-sizes-text-xs, 12px)",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "var(--Line-height-text-xs, 16px)",
  };

  const closeButtonStyle: React.CSSProperties = {
    display: "flex",
    padding: "8px 16px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    border: "1px solid var(--Text-Border, #E5E5E5)",
    background: "var(--Text-White, #FFF)",
    height: "auto",
  };

  const editButtonStyle: React.CSSProperties = {
    display: "flex",
    padding: "8px 16px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    background: "var(--Brand-Main, #0588F0)",
    border: "none",
    height: "auto",
  };

  return (
    <Modal
      open={isModalOpen}
      width={1000}
      onCancel={handleCancel}
      title={
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.5,
          }}
        >
          CHI TIẾT BÀI VIẾT
        </Typography.Title>
      }
      centered
      style={{ top: 20 }}
      footer={
        <Space>
          <Button onClick={handleCancel} style={closeButtonStyle}>
            Đóng
          </Button>
          {!hiddenEdit && (
            <Button onClick={handleEdit} type="primary" style={editButtonStyle}>
              Chỉnh sửa
            </Button>
          )}
        </Space>
      }
    >
      <div style={{ maxHeight: "75vh", overflow: "auto", paddingInline: 8 }}>
        <div
          style={{
            marginBottom: 28,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
            alignSelf: "stretch",
          }}
        >
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              color: "var(--Text-Main, #0A0A0A)",
              fontFamily: "var(--Font-family-Text, Inter)",
              fontSize: "var(--Font-sizes-text-lg, 18px)",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "var(--Line-height-text-lg, 28px)",
            }}
          >
            {model.Title || "Xem tin"}
          </Typography.Title>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Typography.Text style={valueStyle}>
              {FormatDateTime(model.CreatedDate)}
            </Typography.Text>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Typography.Text style={valueStyle}>
                {model.ViewCount ?? 0}
              </Typography.Text>
              <EyeOutlined />
            </div>
          </div>
          {model.CreatedBy ? (
            <Typography.Text style={labelStyle}>
              Người đăng: {model.CreatedBy}
            </Typography.Text>
          ) : null}
        </div>

        {model.Thumbnail ? (
          <div
            style={{
              marginBottom: 28,
              width: "100%",
              overflow: "hidden",
              borderRadius: 12,
            }}
          >
            <img
              src={
                Array.isArray(model.Thumbnail)
                  ? model.Thumbnail[0]?.toString()
                  : model.Thumbnail.toString()
              }
              alt={model.Title || "thumbnail"}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        ) : null}

        <div
          style={{
            color: "#27272a",
            fontSize: 16,
            lineHeight: 1.8,
            letterSpacing: "0.01em",
            marginBottom: 20,
          }}
          dangerouslySetInnerHTML={{
            __html: model.Content || "<p>Không có nội dung</p>",
          }}
        />
      </div>
    </Modal>
  );
};

export default NewPreview;