import { UploadOutlined } from "@ant-design/icons";
import { Button, Space, Upload, type UploadProps } from "antd";
import { useSession } from "next-auth/react";
import ReactPlayer from "react-player";
import { fileServices } from "@/services/api/services/fileServices";

type UploadModel = {
  tableName: number;
  resize?: boolean;
  watermark?: boolean;
  type?: string;
};

type Props = {
  text?: string;
  model: UploadModel;
  onDelete?: (uid: string) => void;
} & UploadProps;

const VideoUpload = ({
  text,
  maxCount,
  fileList,
  model,
  onDelete,
  ...props
}: Props) => {
  const { data: session } = useSession();
  return (
    <Space wrap align="center">
      <Space direction="vertical" wrap>
        {fileList && fileList.length > 0 && (
          <ReactPlayer
            width={350}
            url={fileList[0]?.url || fileList[0]?.response?.data?.[0]}
            controls
          />
        )}
        <Upload
          maxCount={maxCount}
          fileList={fileList}
          name="files" // name payload in FormData
          headers={{
            Authorization: `Bearer ${session?.user?.token}`,
            Token: session?.user?.token ?? "",
          }}
          data={model}
          beforeUpload={fileServices.beforeUpload}
          {...props}
        >
          <Button icon={<UploadOutlined />}>Tải video lên</Button>
        </Upload>
        {fileList && fileList.length > 0 && (
          <Button onClick={() => onDelete?.(fileList[0].uid)}>Xoá</Button>
        )}
      </Space>
    </Space>
  );
};

export default VideoUpload;
