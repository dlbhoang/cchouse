import {
  Card,
  Col,
  Image,
  Row,
  Space,
  Statistic,
  Tooltip,
  Typography,
} from "antd";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormatDate } from "@/lib/core/utils/myFormat";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { useAdminContext } from "@/lib/stored";

type Props = {
  image: IMyUploadFile;

  preview?: boolean;
  onDelete?: (uid: string) => void;
  onSelect?: (uid: string, checked: boolean) => void;
  onClick: () => void;
};
const CardImageHorizontal = ({
  image,
  preview,

  onDelete,
  onSelect,
  onClick,
}: Props) => {
  const { smallScreen } = useAdminContext();
  const { uid, url, createdBy, createdDate, updatedBy, updatedDate } = image;
  const ImageButton = (
    <div style={{ position: "relative" }}>
      <Image
        src={url}
        alt={uid}
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
            onClick={() => onDelete(uid)}
          >
            <Trash2Icon />
          </Button>
        </Tooltip>
      )}
    </div>
  );
  if (smallScreen) return ImageButton;

  return (
    <Card style={{ width: 250 }} size="small">
      <Row gutter={12} align={"middle"}>
        <Col span={8}>
          <Image
            src={url}
            alt={uid}
            height={120}
            onClick={onClick}
            preview={preview ?? false}
          />
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
                  onClick={() => onDelete(uid)}
                >
                  <Trash2Icon />
                </Button>
              </Tooltip>
            </Space>
          )}
        </Col>
        <Col span={16}>
          <Statistic
            title="Người nhập"
            value={createdBy}
            valueStyle={{ fontSize: 14 }}
          />
          <Typography.Text style={{ fontSize: 10 }}>
            {FormatDate(createdDate)}
          </Typography.Text>
          <br />
          <Statistic
            title="Người xoá"
            value={updatedBy}
            valueStyle={{ color: "orange", fontSize: 14 }}
          />
          <Typography.Text type={"warning"} style={{ fontSize: 10 }}>
            {FormatDate(updatedDate)}
          </Typography.Text>
        </Col>
      </Row>
    </Card>
  );
};

export default CardImageHorizontal;
