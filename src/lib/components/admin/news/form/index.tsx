import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import AppUpload from "@/lib/components/shared/components/app-upload";
import SelectBase from "@/lib/components/shared/MySelect/base/SelectBase";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import TinyEditor from "@/lib/components/shared/tiny-editor";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETableName } from "@/lib/core/enum";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import type { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import { useAdminContext } from "@/lib/stored";
import imagesApi from "@/services/api/imagesApi";
import type { INewsRequest, INewsResponse } from "@/services/api/news/INews";
import newsApi from "@/services/api/news/newsApi";
import newsTypeApi from "@/services/api/news/newsTypeApi";
import { fileServices } from "@/services/api/services/fileServices";
import NewPreview from "../preview";

type Props = {
  model?: INewsRequest;
  onClose?: () => void;
};

const NewsForm = ({ model, onClose }: Props) => {
  const router = useRouter();
  const { smallScreen } = useAdminContext();
  const [newsType, setNewsType] = useState<string>();
  const [openPreview, setOpenPreview] = useState(false);

  const { data } = newsTypeApi.useGet({ pageIndex: 1, pageSize: 100 });
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm<INewsRequest>();

  const onFinish = async (values: INewsRequest) => {
    try {
      setIsSubmit(true);

      if (values.Thumbnail && Array.isArray(values.Thumbnail)) {
        const res = fileServices.processFiles(values.Thumbnail);
        values.Thumbnail = res.toString();
      }

      console.log(values);
      if (model?.Id) {
        await newsApi.update(values);
      } else await newsApi.add(values);
      mutate(newsApi.mutateKey);
      router.replace(AppRoutes.news.url);
    } finally {
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        Thumbnail: fileServices.mapFromString(model.Thumbnail),
      });
    }
  }, [form, model]);

  return (
    <div className="news-form-wrapper">
      {/* Header Section */}
      <div className="news-form-header">
        <h1 className="news-form-title">
          {model ? "CẬP NHẬT BÀI VIẾT" : "THÊM BÀI VIẾT"}
        </h1>
        {onClose && (
          <button className="news-form-close" onClick={onClose}>
            <CloseOutlined />
          </button>
        )}
      </div>

      {/* Form Content */}
      <div className="news-form-content">
        <Form
          name="news-form"
          initialValues={model}
          onFinish={onFinish}
          onFinishFailed={globalHandleFailed(form)}
          autoComplete="off"
          form={form}
          layout="vertical"
          disabled={isSubmit}
          className="form-container"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <Form.Item name="Id" hidden>
            <Input />
          </Form.Item>

          <div className="form-scrollable-area">
            <Row gutter={[24, 0]} className="form-row">
              {/* Left Column - Metadata */}
              <Col xs={24} lg={6} className="form-left-column">
                {/* News Type */}
                <Form.Item
                  label={
                    <span className="form-label">
                      Loại tin <span className="required">*</span>
                    </span>
                  }
                  name="NewsTypeId"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại tin" },
                  ]}
                >
                  <SelectBase
                    options={data?.data?.map((e) => ({
                      value: e.Id ?? 0,
                      label: e.Name,
                    }))}
                    placeholder="Chọn loại tin"
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: "8px 0" }} />
                        <Space style={{ padding: "0 8px 4px" }}>
                          <Input
                            onChange={(val) =>
                              val && setNewsType(val.target.value)
                            }
                            placeholder="Thêm loại tin mới"
                            size="small"
                          />
                          <Button
                            type="text"
                            onClick={async () => {
                              if (newsType) {
                                await newsTypeApi.add({
                                  Name: newsType,
                                  NewsCount: 0,
                                });
                                mutate(newsApi.mutateKey);
                                setNewsType(undefined);
                              } else
                                NotiBase("error", "Vui lòng nhập tên loại");
                            }}
                            size="small"
                          >
                            Thêm
                          </Button>
                        </Space>
                      </>
                    )}
                  />
                </Form.Item>

                {/* Thumbnail Image */}
                <Form.Item
                  label={
                    <span className="form-label">
                      Hình minh hoạ <span className="required">*</span>
                    </span>
                  }
                  name="Thumbnail"
                  valuePropName="fileList"
                  getValueFromEvent={(e: any) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn hình minh hoạ",
                    },
                  ]}
                >
                  <AppUpload
                    maxCount={1}
                    accept="image/*"
                    action={imagesApi.uploadUrl}
                    model={{
                      TableName: ETableName.News,
                      resize: false,
                      watermark: false,
                    }}
                    showUploadList={false}
                    onDelete={(uid) => {
                      const imagesValue = form.getFieldValue(
                        "Thumbnail"
                      ) as IMyUploadFile[];
                      form.setFieldValue(
                        "Thumbnail",
                        imagesValue.filter((x) => x.uid !== uid)
                      );
                    }}
                  />
                </Form.Item>

                {/* Summary */}
                <Form.Item
                  label={
                    <span className="form-label">
                      Tóm tắt <span className="required">*</span>
                    </span>
                  }
                  name="Summary"
                  rules={[
                    { required: true, message: "Vui lòng nhập tóm tắt" },
                  ]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="Nhập tóm tắt bài viết..."
                    showCount={{
                      formatter: ({ count, maxLength }) =>
                        `${count} / ${maxLength} kí tự`,
                    }}
                    maxLength={350}
                    className="textarea-input"
                  />
                </Form.Item>
              </Col>

              {/* Right Column - Main Content */}
              <Col xs={24} lg={18} className="form-right-column">
                {/* Title */}
                <Form.Item
                  label={
                    <span className="form-label">
                      Tiêu đề <span className="required">*</span>
                    </span>
                  }
                  name="Title"
                  rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề" },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Nhập tiêu đề bài viết..."
                    showCount={{
                      formatter: ({ count, maxLength }) =>
                        `${count} / ${maxLength} kí tự`,
                    }}
                    maxLength={150}
                    className="textarea-input"
                  />
                </Form.Item>

                {/* Content Editor */}
                <Form.Item
                  label={
                    <span className="form-label">
                      Nội dung <span className="required">*</span>
                    </span>
                  }
                  name="Content"
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung" },
                  ]}
                >
                  <TinyEditor />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </div>

      {/* Bottom Fixed Actions */}
      <div className="news-form-bottom-fixed">
        <div className="bottom-actions">
          <Space size="middle">
            <Button
              icon={<EyeOutlined />}
              size="large"
              className="preview-button"
              onClick={async () => {
                if (await form.validateFields()) setOpenPreview(true);
              }}
            >
              Xem trước
            </Button>
            <Button
              type="primary"
              size="large"
              block={smallScreen}
              loading={isSubmit}
              htmlType="submit"
              className="submit-button"
              onClick={() => form.submit()}
            >
              {model ? "Cập nhật" : "Duyệt tin"}
            </Button>
          </Space>
        </div>
      </div>

      {/* Preview Modal */}
      <NewPreview
        hiddenEdit
        model={form.getFieldsValue() as INewsResponse}
        isModalOpen={openPreview}
        handleCancel={() => setOpenPreview(false)}
      />

      <style jsx>{`
        .news-form-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          background-color: #fff;
          overflow: hidden;
          touch-action: pan-y;
          overscroll-behavior: contain;
        }

        .news-form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          background-color: #fff;
          flex-shrink: 0;
        }

        .news-form-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.5px;
          color: #000;
        }

        .news-form-close {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #999;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
          min-width: 32px;
          min-height: 32px;
          margin-right: -8px;
        }

        .news-form-close:hover {
          color: #333;
        }

        .news-form-content {
          flex: 1;
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          min-height: 0;
        }

        .form-scrollable-area {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          overscroll-behavior: contain;
        }

        .news-form-bottom-fixed {
          border-top: 1px solid #f0f0f0;
          padding: 12px 16px;
          background-color: #fff;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          flex-shrink: 0;
          box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
          position: relative;
          z-index: 100;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }

        .form-label {
          font-weight: 500;
          font-size: 13px;
          color: #333;
        }

        .required {
          color: #ff4d4f;
          margin-left: 4px;
        }

        .form-row {
          margin-bottom: 0;
        }

        .form-left-column,
        .form-right-column {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .textarea-input {
          font-size: 13px;
          border-radius: 4px;
        }

        .textarea-input:focus {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .bottom-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 0;
          width: 100%;
          gap: 8px;
        }

        .preview-button {
          border-color: #89bf04;
          color: #89bf04;
          background: #fff;
        }

        .preview-button:hover {
          border-color: #7aad03;
          color: #7aad03;
          background: #fafbf1;
        }

        .submit-button {
          min-width: 100px;
          background: #89bf04;
          border-color: #89bf04;
          color: #fff;
        }

        .submit-button:hover {
          background: #7aad03;
          border-color: #7aad03;
          color: #fff;
        }

        /* Compact styling for form items */
        :global(.news-form-wrapper .ant-form-item) {
          margin-bottom: 12px !important;
        }

        :global(.news-form-wrapper .ant-form-item-label) {
          padding-bottom: 4px !important;
        }

        /* Tablet & Desktop */
        @media (max-width: 992px) {
          .news-form-header {
            padding: 12px 16px;
          }

          .news-form-title {
            font-size: 14px;
          }

          .form-scrollable-area {
            padding: 16px;
          }

          .bottom-actions {
            flex-direction: column;
            gap: 8px;
          }

          .submit-button {
            width: 100%;
          }
        }

        /* Mobile - CRITICAL FIX */
        @media (max-width: 576px) {
          .news-form-wrapper {
            height: 100%;
            overflow: hidden;
          }

          .news-form-header {
            padding: 10px 12px;
            flex-shrink: 0;
          }

          .news-form-title {
            font-size: 13px;
          }

          .news-form-content {
            flex: 1;
            overflow: hidden;
            padding: 0;
          }

          .form-scrollable-area {
            flex: 1;
            overflow-y: auto;
            padding: 12px 8px;
            -webkit-overflow-scrolling: touch;
          }

          .news-form-bottom-fixed {
            padding: 10px 8px;
            flex-shrink: 0;
            gap: 6px;
          }

          .form-label {
            font-size: 12px;
          }

          :global(.news-form-wrapper .ant-form-item) {
            margin-bottom: 10px !important;
          }

          .textarea-input {
            font-size: 12px;
            min-height: 80px !important;
          }

          .bottom-actions {
            width: 100%;
            flex-wrap: wrap;
            gap: 6px;
          }

          .preview-button,
          .submit-button {
            flex: 1;
            min-width: 100px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsForm;