import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, type FormInstance, Image, Upload } from "antd";
import type { Rule } from "antd/es/form";
import type { RcFile, UploadFile } from "antd/es/upload";
import type { ItemRender } from "antd/es/upload/interface";
import type { UploadProps } from "antd/lib";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FormatDate } from "@/lib/core/utils/myFormat";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import imagesApi from "@/services/api/imagesApi";
import { fileServices } from "../../../../../services/api/services/fileServices";

type UploadModel = {
  tableName: number;
  resize?: boolean;
  watermark?: boolean;
};

type Props = {
  form: FormInstance;
  name: string | string[];
  label?: string;
  rules?: Rule[];
  isFile?: boolean;
  hidden?: boolean;
  className?: string;
  model: UploadModel;
} & Omit<UploadProps, "name">;

const CustomRender: ItemRender = (
  node,
  file,
  fileList,
  { preview, remove }
) => {
  const myFile = file as IMyUploadFile;
  return (
    <div className="ant-upload-list-item">
      <a
        className="ant-upload-list-item-thumbnail"
        href={myFile.url ?? myFile.thumbUrl}
        target="_blank"
        onClick={preview}
        rel="noopener noreferrer"
      >
        <img
          src={myFile?.url ?? myFile.thumbUrl}
          alt="953b19e5-c910-41fa-95e8-e7b1a12f3419.jpg"
          className="ant-upload-list-item-image"
        />
      </a>
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={preview}
      >
        <span
          className="ant-upload-list-item-name"
          title={myFile?.createdBy ?? myFile.name}
        >
          {myFile?.createdBy ?? myFile.name}
        </span>
        <span
          className="ant-upload-list-item-name"
          title={FormatDate(myFile?.createdDate)}
        >
          {FormatDate(myFile?.createdDate)}
        </span>
      </div>
      <span className="ant-upload-list-item-actions picture">
        <button
          title="Gỡ bỏ tập tin"
          type="button"
          className="ant-btn css-dev-only-do-not-override-1k6njaq ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-action"
          onClick={remove}
        >
          <span className="ant-btn-icon">
            <span
              role="img"
              aria-label="delete"
              tabIndex={-1}
              className="anticon anticon-delete"
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="delete"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
              </svg>
            </span>
          </span>
        </button>
      </span>
    </div>
  );
};

export const UploadItem = ({
  form,
  name,
  label,
  rules,
  multiple,
  showUploadList,
  maxCount,
  isFile,
  listType,
  itemRender,
  hidden,
  className,
  model,
  action = imagesApi.uploadUrl,
  ...props
}: Props) => {
  const { data: session } = useSession();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<
    { url: string; uid: string }[]
  >([]);
  const [previewIdx, setPreviewIdx] = useState<number>();

  const filesWatch: UploadFile[] = Form.useWatch(name, form);

  const handlePreview = async (file: UploadFile) => {
    for (let idx = 0; idx < filesWatch.length; idx++) {
      const e = filesWatch[idx];
      if (!e.url && !e.preview) {
        e.preview = await fileServices.getBase64(e.originFileObj as RcFile);
      }
    }

    const result = filesWatch.map((e) => ({
      url: e.url || (e.preview as string),
      uid: e.uid,
    }));
    const itemPreview = result.find((x) => x.uid === file.uid);

    setPreviewImage(result);
    if (itemPreview) setPreviewIdx(result.findIndex((x) => x.uid === file.uid));
    setPreviewOpen(true);
  };

  const uploadButton =
    listType === "picture" ? (
      <Button icon={<UploadOutlined />}>Tải lên</Button>
    ) : (
      <div>
        <PlusIcon className="size-4" />
        <div style={{ marginTop: 8 }}>Tải ảnh</div>
      </div>
    );

  const normFile = ({
    file,
    fileList,
  }: {
    file: UploadFile;
    fileList: IMyUploadFile[];
  }) => {
    return fileList;
  };

  return (
    <>
      <Form.Item
        name={name}
        label={label}
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={rules}
        hidden={hidden}
      >
        <Upload
          {...props}
          listType={isFile ? undefined : listType}
          showUploadList={showUploadList}
          name="files" // name payload in FormData
          headers={{
            Authorization: `Bearer ${session?.user?.token}`,
            Token: session?.user?.token ?? "",
          }}
          action={action}
          data={model}
          beforeUpload={fileServices.validateFileUpload}
          className={listType === "picture" ? "upload-list-inline" : className}
          onPreview={handlePreview}
          maxCount={maxCount}
          multiple={multiple}
          accept={isFile ? ".pdf, .doc, .docx" : "image/*"}
          itemRender={listType === "picture" ? CustomRender : undefined}
        >
          {maxCount && (filesWatch?.length ?? 0) >= maxCount
            ? null
            : uploadButton}
        </Upload>
      </Form.Item>

      {previewImage && (
        <Image.PreviewGroup
          preview={{
            visible: previewOpen,
            current: previewIdx,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            onChange: (current) => setPreviewIdx(current),
          }}
        >
          <div style={{ display: "none" }}>
            {previewImage.map((item) => (
              <Image key={item.uid} src={item.url} />
            ))}
          </div>
        </Image.PreviewGroup>
      )}
    </>
  );
};
