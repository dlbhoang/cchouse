import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Steps,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import EmblededGoong from "@/lib/components/shared/EmblededGoong";
import { UploadItem } from "@/lib/components/shared/MyFormItem";
import { ETableName } from "@/lib/core/enum";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import apartmentApi from "@/services/api/apartment/apartmentApi";
import {
  IApartmentRequest,
  IApartmentResponse,
} from "@/services/api/apartment/IApartment";
import { fileServices } from "@/services/api/services/fileServices";
import ApartmentInfoForm from "./info";
import ApartmentOverviewForm from "./overview";

const hiddenFields = ["Id", "Video", "PlaceId", "Lng", "Lat"];

type Props = {
  mode: "step" | "tab";
  model?: IApartmentResponse;
};

const ApartmentForm = ({ mode, model }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [tabKey, setTabKey] = useState<string>("1");

  const [form] = Form.useForm<IApartmentRequest>();

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tổng quan dự án",
      children: <ApartmentOverviewForm form={form} />,
    },
    {
      key: "2",
      label: "Thông tin chi tiết",
      children: <ApartmentInfoForm form={form} />,
    },
    {
      key: "3",
      label: "Hồ sơ pháp lý",
      children: (
        <Space direction="vertical">
          <Typography.Text type="secondary">* tối đa 10 hình</Typography.Text>
          <UploadItem
            form={form}
            maxCount={10}
            multiple
            name="LawImages"
            model={{ tableName: ETableName.Apartment }}
          />
        </Space>
      ),
    },
    {
      key: "4",
      label: "Vị trí",
      children: (
        <EmblededGoong
          form={form}
          address={form.getFieldsValue()}
          name={{ placeId: "PlaceId", lng: "Lng", lat: "Lat" }}
        />
      ),
    },
  ];
  const onFinish = async () => {
    try {
      const values: IApartmentRequest = form.getFieldsValue(true);
      console.log("Success:", values);

      if (Array.isArray(values.Images)) {
        values.Images = await fileServices.uploadImages(
          values.Images,
          "Apartment"
        );
      }
      if (Array.isArray(values.LawImages)) {
        values.LawImages = await fileServices.uploadImages(
          values.LawImages,
          "Apartment"
        );
      }

      if ((values?.Id ?? 0) > 0) {
        await apartmentApi.update({
          ...model,
          ...values,
        });
        mutate(apartmentApi.mutateKey);
      } else {
        await apartmentApi.add(values);
        router.back();
      }
    } finally {
      setLoading(false);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleNext = async () => {
    if (current === 0) {
      await form.validateFields([
        "Name",
        "Description",
        "ProvinceId",
        "DistrictId",
        "WardId",
        "StreetId",
        "AddressNumber",
        "Location",
      ]);
    } else await form.validateFields(["Types", "Area", "Law"]);

    setCurrent(current + 1);
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        Images: fileServices.mapFromString(model.Images),
        LawImages: fileServices.mapFromString(model.LawImages),
        Video: model.Video
          ? fileServices.mapFromString(model.Video.toString())
          : null,
      });
    }
  }, [form, model]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("errorInfo", errorInfo);

    const messagesTab1 = form.getFieldsError([
      "Name",
      "ProvinceId",
      "DistrictId",
      "WardId",
      "StreetId",
      "AddressNumber",
      "Location",
      "Description",
    ]);

    if (messagesTab1.filter((e) => e.errors.length > 0).length === 0) {
      const messagesTab2 = form.getFieldsError(["Types", "Law", "Area"]);
      if (messagesTab2.length > 0) {
        setTabKey("2");
      }
    } else if (tabKey !== "1") setTabKey("1");
  };

  if (mode === "step")
    return (
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={globalHandleFailed(form)}
        autoComplete="off"
        form={form}
        initialValues={{ ProvinceId: 1 }}
        layout="vertical"
        disabled={loading}
      >
        {hiddenFields.map((e) => (
          <Form.Item key={e} name={e} hidden>
            <Input />
          </Form.Item>
        ))}
        <Steps
          current={current}
          items={items.map((e) => ({ key: e.label, title: e.label }))}
        />
        <Row>
          <Col span={24} style={{ padding: 10 }}>
            {items[current].children}
          </Col>
          <Col span={24}>
            <Space>
              {current < items.length - 1 && (
                <Button type="primary" onClick={handleNext}>
                  Tiếp tục
                </Button>
              )}
              {current === items.length - 1 && (
                <Button type="primary" loading={loading} htmlType="submit">
                  Xong
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                  Trở về
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    );

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
      layout="vertical"
      disabled={loading}
    >
      {hiddenFields.map((e) => (
        <Form.Item key={e} name={e} hidden>
          <Input />
        </Form.Item>
      ))}

      <Tabs activeKey={tabKey} items={items} onChange={setTabKey} />
      <Button type="primary" htmlType="submit" style={{ marginBlock: 10 }}>
        Cập nhật
      </Button>
    </Form>
  );
};

export default ApartmentForm;
