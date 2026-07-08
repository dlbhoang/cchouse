import { Col, Dropdown, Form, Input, Row } from "antd";
import { DownOutlined, SearchOutlined, EditOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { NewsTypeSelect, StatusBaseSelect, UserAdminSelect } from "@/lib/components/shared/MySelect";
import { appConst } from "@/lib/core/configs/appConst";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";

import FloatingFieldStyle from "./FloatingFieldStyle";
import FloatingField from "./FloatingField";
import NewsDateFilter from "./NewsDateFilter";

const hiddenFields = ["IsWebsite", "pageSize", "pageIndex", "fromDate", "toDate"];

const sourceMenuItems = [
  { key: "write", label: "Viết bài", icon: <EditOutlined /> },
  { key: "share", label: "Chia sẻ", icon: <ShareAltOutlined /> },
];

type Props = {
  model?: INewsOpts;
  onSubmit: (values: INewsOpts) => void;
  extra?: ReactNode;
};

const isFilledValue = (value: unknown) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== "";
};

const NewsFilter = ({ model, onSubmit, extra }: Props) => {
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<INewsOpts>();
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceMenuWidth, setSourceMenuWidth] = useState<number>();
  // Nhãn đang được chọn trong dropdown "Nguồn" (Viết bài / Chia sẻ), hiển thị
  // trực tiếp trong ô như một combobox thật thay vì luôn để trống.
  const [sourceLabel, setSourceLabel] = useState<string>();
  const sourceTriggerRef = useRef<HTMLDivElement>(null);

  const createdByWatch = Form.useWatch("CreatedBy", form);
  const newsTypeIdsWatch = Form.useWatch("NewsTypeIds", form);
  const fromDateWatch = Form.useWatch("fromDate", form);
  const statusWatch = Form.useWatch("Status", form);

  useEffect(() => {
    if (!model) {
      return;
    }

    form.setFieldsValue({
      ...model,
    });
  }, [form, model]);

  const submitOnChange = () => form.submit();

  const handleSourceOpenChange = (open: boolean) => {
    if (open && sourceTriggerRef.current) {
      // Đo đúng chiều rộng thật của ô trigger để menu bên dưới luôn khớp
      // tuyệt đối 2 bên, không bị hở/lệch dù màn hình responsive thế nào.
      setSourceMenuWidth(sourceTriggerRef.current.offsetWidth);
    }
    setSourceOpen(open);
  };

  const authorField = (
    <FloatingField label="Người đăng" required filled={isFilledValue(createdByWatch)}>
      <Form.Item name="CreatedBy" noStyle>
        <UserAdminSelect valueAsName placeholder="Chọn" onChange={submitOnChange} />
      </Form.Item>
    </FloatingField>
  );

  const sourceField = (
    <FloatingField
      label="Nguồn"
      required
      filled={isFilledValue(newsTypeIdsWatch) || isFilledValue(sourceLabel) || sourceOpen}
    >
      <Dropdown
        menu={{
          items: sourceMenuItems,
          onClick: ({ key }) => {
            const chosen = sourceMenuItems.find((item) => item.key === key);
            setSourceLabel(chosen?.label);
            // TODO: gắn hành động thật cho "Viết bài" / "Chia sẻ" tại đây.
          },
        }}
        trigger={["click"]}
        placement="bottomLeft"
        overlayClassName="news-source-menu"
        onOpenChange={handleSourceOpenChange}
        dropdownRender={(menu) => (
          <div style={{ width: sourceMenuWidth }}>{menu}</div>
        )}
      >
        <div
          ref={sourceTriggerRef}
          className={`news-source-dropdown ${sourceOpen ? "news-source-dropdown--open" : ""}`}
        >
          <span
            className={`news-source-dropdown-text${
              sourceLabel ? " news-source-dropdown-text--filled" : ""
            }`}
          >
            {sourceLabel ?? "Chọn"}
          </span>
          <DownOutlined className="news-source-dropdown-icon" />
        </div>
      </Dropdown>
    </FloatingField>
  );

  const dateField = (
    <FloatingField label="Thời gian" required filled={isFilledValue(fromDateWatch)}>
      <Form.Item noStyle>
        <NewsDateFilter form={form} onValueChange={submitOnChange} />
      </Form.Item>
    </FloatingField>
  );

  const statusField = (
    <FloatingField label="Trạng thái" required filled={isFilledValue(statusWatch)}>
      <Form.Item name="Status" noStyle>
        <StatusBaseSelect placeholder="Chọn" onChange={submitOnChange} />
      </Form.Item>
    </FloatingField>
  );

  const searchField = (
    <div className="news-filter-search-field">
      <Form.Item name="search" noStyle>
        <Input
          placeholder="Tìm kiếm theo tiêu đề"
          prefix={<SearchOutlined />}
          allowClear
          onPressEnter={submitOnChange}
        />
      </Form.Item>
    </div>
  );

  const hiddenFormItems = hiddenFields.map((e) => (
    <Form.Item key={e} name={e} hidden>
      <Input />
    </Form.Item>
  ));

  if (smallScreen) {
    return (
      <Form
        name="news-filter"
        className="news-filter-form"
        onFinish={onSubmit}
        onFinishFailed={globalHandleFailed(form)}
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <FloatingFieldStyle />
        {hiddenFormItems}

        <Row gutter={[12, 16]}>
          <Col xs={24} sm={12}>
            {authorField}
          </Col>
          <Col xs={24} sm={12}>
            {sourceField}
          </Col>
          <Col xs={24} sm={12}>
            {dateField}
          </Col>
          <Col xs={24} sm={12}>
            {statusField}
          </Col>
          <Col xs={24}>{searchField}</Col>
          {extra && <Col xs={24}>{extra}</Col>}
        </Row>
      </Form>
    );
  }

  return (
    <Form
      name="news-filter"
      className="news-filter-form"
      onFinish={onSubmit}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      form={form}
      layout="vertical"
    >
      <FloatingFieldStyle />
      {hiddenFormItems}

      <div className="news-filter-toolbar">
        <div className="news-filter-field news-filter-field--user">{authorField}</div>
        <div className="news-filter-field news-filter-field--source">{sourceField}</div>
        <div className="news-filter-field news-filter-field--date">{dateField}</div>
        <div className="news-filter-field news-filter-field--status">{statusField}</div>
        <div className="news-filter-field news-filter-field--search">{searchField}</div>
        {extra && <div className="news-filter-extra">{extra}</div>}
      </div>
    </Form>
  );
};

export default NewsFilter;