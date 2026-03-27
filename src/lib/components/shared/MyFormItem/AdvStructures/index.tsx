import {
  Button,
  Col,
  Form,
  FormInstance,
  InputNumber,
  Modal,
  Row,
  Typography,
} from "antd";
import { useState } from "react";

import { CombineStructures } from "@/lib/core/utils/myFormat";
import { useAdminContext } from "@/lib/stored";
import { StructuresCbx } from "../../MyCheckbox";
import { FloorSelect } from "../../MySelect";

type Props = {
  form: FormInstance;
  namePath?: {
    FloorsItem: string | string[];
    StructuresItem: string | string[];
    BasementItem: string | string[];
  };
};
const defaultItems = {
  FloorsItem: ["Property", "Floors"],
  StructuresItem: ["Property", "Structures"],
  BasementItem: ["Property", "Basement"],
};
const labelCol = {
  xs: 24,
};
export const AdvStructures = ({ form, namePath = defaultItems }: Props) => {
  const { enumList } = useAdminContext();
  const [open, setOpen] = useState(false);

  const title = CombineStructures(enumList.Structures, {
    Basement: form.getFieldValue(namePath.BasementItem),
    Floors: form.getFieldValue(namePath.FloorsItem),
    Structures: form.getFieldValue(namePath.StructuresItem),
  });

  return (
    <>
      <Button block onClick={() => setOpen(true)} title={title}>
        <Typography.Text ellipsis type={title ? undefined : "secondary"}>
          {title || "Nhập kết cấu"}
        </Typography.Text>
      </Button>

      <Modal
        title="Kết cấu"
        closeIcon={null}
        maskClosable={false}
        open={open}
        cancelButtonProps={{ style: { display: "none" } }}
        cancelText="Đóng"
        okText="Xác nhận"
        onOk={async () => {
          if (
            await form.validateFields([
              namePath.FloorsItem,
              namePath.BasementItem,
              namePath.StructuresItem,
            ])
          )
            setOpen(false);
        }}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Hầm"
              labelCol={labelCol}
              name={namePath.BasementItem}
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số lầu"
              labelCol={labelCol}
              name={namePath.FloorsItem}
              rules={[{ required: true }]}
            >
              <FloorSelect />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Kết cấu thêm"
              labelCol={labelCol}
              name={namePath.StructuresItem}
            >
              <StructuresCbx />
              {/* <StructuresSelect mode="multiple" /> */}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
