"use client";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Button, Result, Upload } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import FloatBtn from "@/lib/components/shared/FloatBtn";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import type { IConfig } from "@/lib/interfaces/base/IBase";
import { fileServices } from "@/services/api/services/fileServices";
import utilsApi from "@/services/api/utilsApi";

const ValidateFile = (fileUpload: UploadFile): boolean => {
  console.log(fileUpload.type);

  const isJpgOrPng = fileUpload.type === "application/pdf";
  if (!isJpgOrPng) {
    NotiBase("error", "Chỉ hỗ trợ file PDF");
    return false;
  }
  return true;
};

const RulePage = () => {
  const [data, setData] = useState<IConfig>();
  const { data: session } = useSession();
  useEffect(() => {
    const fetch = async () => {
      const result = await utilsApi.getConfig();
      setData(result.data);
    };
    fetch();
  }, []);

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
    file,
  }) => {
    console.log("handleChange");

    if (file.status === "error") {
      NotiBase("error", `${file.name} tải lên thất bại`);
    }
    const isValid = ValidateFile(file);
    if (isValid) {
      const result = await fileServices.uploadFiles([file], "Document");
      if (result && data)
        await utilsApi.putConfig({ ...data, RuleUrl: result.toString() });
    }
    // setFileList(newFileList);
  };

  return data?.RuleUrl ? (
    <>
      <object
        data={data.RuleUrl}
        type="application/pdf"
        width="100%"
        height="100%"
        aria-label="rule_cchouse"
      />
      {[1, 2].includes(session?.user.RoleId ?? 0) && (
        <Upload showUploadList={false} onChange={handleChange}>
          <FloatBtn onClick={() => {}} />
        </Upload>
      )}
    </>
  ) : (
    <Result
      title="KHÔNG TÌM THẤY DỮ LIỆU"
      extra={
        [1, 2].includes(session?.user.RoleId ?? 0) && (
          <Upload showUploadList={false} onChange={handleChange}>
            <Button type="primary" key="console" icon={<UploadOutlined />}>
              Thêm quy định
            </Button>
          </Upload>
        )
      }
    />
  );
};

export default RulePage;
