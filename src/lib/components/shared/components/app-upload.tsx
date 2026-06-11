import { Space, Upload, type UploadProps } from "antd";
import { PlusCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { fileServices } from "@/services/api/services/fileServices";
import ImagesPreview from "../ImagesPreview";

type UploadModel = {
  TableName: number;
  resize?: boolean;
  watermark?: boolean;
};

type Props = {
  model: UploadModel;
  onDelete?: (uid: string) => void;
} & UploadProps;

const AppUpload = ({
  maxCount,
  fileList,
  model,
  onDelete,
  ...props
}: Props) => {
  const { data: session } = useSession();

  const uploadButton = (
    <div className="flex flex-col items-center gap-2">
      <PlusCircleIcon className="size-4" />
      <span>Tải ảnh</span>
    </div>
  );

  return (
    <Space wrap align="center">
      {fileList && fileList.length > 0 && (
        <ImagesPreview
          images={fileList as IMyUploadFile[]}
          imgWidth={120}
          onDelete={onDelete}
        />
      )}
      <Upload
        listType="picture-card"
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
        {maxCount && (fileList?.length ?? 0) >= maxCount ? null : uploadButton}
      </Upload>
    </Space>
  );
};

export default AppUpload;
