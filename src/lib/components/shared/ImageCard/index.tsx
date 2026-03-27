import { Card, Checkbox, Image, Space, Spin, Tooltip, Typography } from "antd";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { useAdminContext } from "@/lib/stored";
import { FormatDate } from "../../../core/utils/myFormat";

const { Text } = Typography;
const { Meta } = Card;

type Props = {
  model: IMyUploadFile;
  preview?: boolean;
  onDelete?: (uid: string) => void;
  onSelect?: (uid: string, checked: boolean) => void;
  onClick: () => void;
};
const ImageCard = ({ model, preview, onDelete, onSelect, onClick }: Props) => {
  const { smallScreen } = useAdminContext();
  const textColor = onDelete ? undefined : "warning";

  const ImageButton = (
    <div style={{ position: "relative" }}>
      <Image
        src={model.url || model.response?.data?.[0]}
        alt={model.uid}
        width={80}
        height={80}
        style={{ padding: 5 }}
        onClick={onClick}
        preview={preview ?? false}
      />
      {onDelete && (
        <Tooltip title="Xóa">
          <Button
            size="icon-sm"
            variant="outline"
            className="rounded-full absolute top-1 right-1"
            onClick={() => onDelete(model.uid)}
          >
            <Trash2Icon />
          </Button>
        </Tooltip>
      )}
    </div>
  );
  if (smallScreen) return ImageButton;

  return (
    <Spin spinning={model.status === "uploading"}>
      <Card
        style={{ width: 120 }}
        cover={
          <Image
            src={model.url || model.response?.data?.[0]}
            alt={model.status === "uploading" ? undefined : model.uid}
            height={100}
            onClick={onClick}
            preview={preview ?? false}
          />
        }
        size="small"
      >
        {model.createdBy && model.createdDate && (
          <Meta
            avatar={
              onSelect && (
                <Checkbox
                  onChange={(e) => onSelect(model.uid, e.target.checked)}
                />
              )
            }
            title={
              <Text
                type={textColor}
                style={{ fontSize: 11, whiteSpace: "wrap" }}
              >
                {model.createdBy}
              </Text>
            }
            description={
              <Text type={textColor || "secondary"} style={{ fontSize: 10 }}>
                {FormatDate(model.createdDate)}
              </Text>
            }
          />
        )}

        {onDelete && (
          <Space
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              top: 5,
              right: 5,
            }}
          >
            <Tooltip title="Xóa">
              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                onClick={() => onDelete(model.uid)}
              >
                <Trash2Icon />
              </Button>
            </Tooltip>
          </Space>
        )}
      </Card>
    </Spin>
  );
};

export default ImageCard;
