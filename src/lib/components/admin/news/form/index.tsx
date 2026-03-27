import { EyeOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import BottomFixed from "@/lib/components/shared/BottomFixed";
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
};
const NewsForm = ({ model }: Props) => {
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
    <Form
      name="basic"
      initialValues={model}
      onFinish={onFinish}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      form={form}
      layout="vertical"
      disabled={isSubmit}
    >
      <Form.Item name="Id" hidden>
        <Input />
      </Form.Item>

      <Row gutter={12}>
        {" "}
        <Col xs={24} lg={6}>
          <Col span={24}>
            <Form.Item
              label="Loại tin"
              name="NewsTypeId"
              rules={[{ required: true }]}
            >
              <SelectBase
                options={data?.data?.map((e) => ({
                  value: e.Id ?? 0,
                  label: e.Name,
                }))}
                placeholder="Chọn"
                // eslint-disable-next-line react/no-unstable-nested-components
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px" }}>
                      <Input
                        onChange={(val) => val && setNewsType(val.target.value)}
                        placeholder="Thêm loại tin mới"
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
                          } else NotiBase("error", "Vui lòng nhập tên loại");
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
          </Col>
          <Col span={24}>
            <Form.Item
              label="Hình minh hoạ"
              name="Thumbnail"
              valuePropName="fileList"
              getValueFromEvent={(e: any) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
              rules={[
                { required: true, message: "Vui lòng chọn hình minh hoạ" },
              ]}
            >
              <AppUpload
                maxCount={1}
                accept="image/*"
                action={imagesApi.uploadUrl}
                model={{
                  tableName: ETableName.News,
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
          </Col>
          <Col span={24}>
            <Form.Item
              label="Tóm tắt"
              name="Summary"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                rows={5}
                showCount={{
                  formatter: ({ count, maxLength }) =>
                    `${count} / ${maxLength} kí tự`,
                }}
                maxLength={350}
              />
            </Form.Item>
          </Col>
        </Col>
        <Col xs={24} lg={18}>
          <Col span={24}>
            <Form.Item
              label="Tiêu đề"
              name="Title"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                rows={2}
                showCount={{
                  formatter: ({ count, maxLength }) =>
                    `${count} / ${maxLength} kí tự`,
                }}
                maxLength={150}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Nội dung"
              name="Content"
              rules={[{ required: true }]}
            >
              <TinyEditor />
            </Form.Item>
          </Col>
        </Col>
      </Row>
      <BottomFixed>
        <Space>
          <Button
            type="primary"
            size="large"
            block={smallScreen}
            loading={isSubmit}
            htmlType="submit"
          >
            {model ? "Cập nhật" : "Thêm mới"}
          </Button>
          <Button
            icon={<EyeOutlined />}
            size="large"
            onClick={async () => {
              if (await form.validateFields()) setOpenPreview(true);
            }}
          >
            Xem tin
          </Button>
        </Space>
      </BottomFixed>

      <NewPreview
        hiddenEdit
        model={form.getFieldsValue() as INewsResponse}
        isModalOpen={openPreview}
        handleCancel={() => setOpenPreview(false)}
      />
    </Form>
  );
};

export default NewsForm;
