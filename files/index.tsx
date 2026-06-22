import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Button,
  Row,
  Col,
  Radio,
  Checkbox,
  Upload,
  DatePicker,
  Space,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from './PropAddEdit.module.css';

interface PropertyData {
  title: string;
  description: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  transactionType: string;
  propertyType: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  images?: any[];
  featured: boolean;
  status: string;
}

const PropAddEdit: React.FC = () => {
  const [form] = Form.useForm<PropertyData>();
  const [images, setImages] = useState<any[]>([]);

  const onFinish = (values: PropertyData) => {
    console.log('Form values:', values);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className={style.pageWrapper} style={{ fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* ── Header ─────────────────────────────────────────── */}
        <Card style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
            Chi Tiết Bất Động Sản
          </h1>
        </Card>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className={style.pageWrapper}
        >
          {/* ── Section 1: Basic Information ─────────────────── */}
          <Card className={style.myCard} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#d46b08' }}>
                THÔNG TIN CƠ BẢN
              </h3>
            </div>

            <div className={style.sectionDivider} />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Tiêu Đề"
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                  <Input placeholder="Nhập tiêu đề bất động sản" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Loại Giao Dịch"
                  name="transactionType"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn loại giao dịch">
                    <Select.Option value="sell">Bán</Select.Option>
                    <Select.Option value="rent">Cho Thuê</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Mô Tả"
                  name="description"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea
                    placeholder="Nhập mô tả chi tiết"
                    rows={4}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* ── Section 2: Property Details ──────────────────── */}
          <Card className={style.myCard} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#d46b08' }}>
                CHI TIẾT BẤT ĐỘNG SẢN
              </h3>
            </div>

            <div className={style.sectionDivider} />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Giá"
                  name="price"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    placeholder="0"
                    formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value: any) => value.replace(/₫\s?|(,*)/g, '')}
                    min={0}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Diện Tích (m²)"
                  name="area"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    placeholder="0"
                    min={0}
                    suffix="m²"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Phòng Ngủ"
                  name="bedrooms"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} placeholder="0" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  label="Phòng Tắm"
                  name="bathrooms"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} placeholder="0" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Loại Bất Động Sản"
                  name="propertyType"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn loại">
                    <Select.Option value="apartment">Căn Hộ</Select.Option>
                    <Select.Option value="house">Nhà Riêng</Select.Option>
                    <Select.Option value="land">Đất Nền</Select.Option>
                    <Select.Option value="shop">Shop/Nhà Mặt Phố</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Trạng Thái"
                  name="status"
                  rules={[{ required: true }]}
                >
                  <Radio.Group>
                    <Radio.Button value="active">Hoạt Động</Radio.Button>
                    <Radio.Button value="inactive">Không Hoạt Động</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* ── Section 3: Location ──────────────────────────── */}
          <Card className={style.myCard} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#d46b08' }}>
                ĐỊA CHỈ
              </h3>
            </div>

            <div className={style.sectionDivider} />

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Địa Chỉ Chi Tiết"
                  name="address"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nhập địa chỉ chi tiết" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Thành Phố"
                  name="city"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn thành phố">
                    <Select.Option value="hanoi">Hà Nội</Select.Option>
                    <Select.Option value="hcm">Hồ Chí Minh</Select.Option>
                    <Select.Option value="danang">Đà Nẵng</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn quận/huyện">
                    <Select.Option value="dist1">Quận 1</Select.Option>
                    <Select.Option value="dist2">Quận 2</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Phường/Xã"
                  name="ward"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn phường/xã">
                    <Select.Option value="ward1">Phường 1</Select.Option>
                    <Select.Option value="ward2">Phường 2</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* ── Section 4: Images ───────────────────────────── */}
          <Card className={style.myCard} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#d46b08' }}>
                HÌNH ẢNH
              </h3>
            </div>

            <div className={style.sectionDivider} />

            <Form.Item
              label="Tải Lên Hình Ảnh"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload.Dragger
                name="files"
                multiple
                action="/upload"
                accept="image/*"
              >
                <p style={{ marginTop: '16px' }}>
                  <PlusOutlined />
                </p>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>
                  Kéo thả hình ảnh hoặc nhấp để chọn
                </p>
                <p style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Hỗ trợ JPG, PNG. Tối đa 10MB
                </p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item
              className={style.formItemCheckbox}
              label="Tùy Chọn"
            >
              <Form.Item name="featured" valuePropName="checked">
                <Checkbox>Nổi Bật</Checkbox>
              </Form.Item>
            </Form.Item>
          </Card>

          {/* ── Sticky Bottom Bar ────────────────────────────── */}
          <div className={style.stickyBottom}>
            <Space style={{ float: 'right', gap: '12px' }}>
              <Button size="large" style={{ borderRadius: '8px' }}>
                Hủy
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#fa8c16',
                  borderColor: '#fa8c16',
                }}
              >
                Lưu
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PropAddEdit;
