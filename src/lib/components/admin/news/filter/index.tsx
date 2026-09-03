import { Col, Dropdown, Form, Input, Row } from "antd";
import { ChevronDown, Search, Pencil, RotateCcw, Share2, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { NewsStatusSelect, UserAdminSelect } from "@/lib/components/shared/MySelect";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";

import FloatingFieldStyle from "./FloatingFieldStyle";
import FloatingField from "./FloatingField";
import NewsDateFilter from "./NewsDateFilter";

const hiddenFields = [
  "IsWebsite",
  "pageSize",
  "pageIndex",
  "fromDate",
  "toDate",
  "SourceType",
];

const sourceMenuItems = [
  { key: "all", label: "Tất cả" },
  { key: "write", label: "Viết bài", icon: <Pencil size={14} /> },
  { key: "share", label: "Chia sẻ", icon: <Share2 size={14} /> },
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
  const [sourceLabel, setSourceLabel] = useState<string>();
  const sourceTriggerRef = useRef<HTMLDivElement>(null);

  const createdByWatch = Form.useWatch("CreatedBy", form);
  const sourceTypeWatch = Form.useWatch("SourceType", form);
  const fromDateWatch = Form.useWatch("fromDate", form);
  const statusWatch = Form.useWatch("Status", form);

  useEffect(() => {
    if (!model) {
      return;
    }

    form.setFieldsValue({
      ...model,
    });
    setSourceLabel(sourceMenuItems.find((item) => item.key === model?.SourceType)?.label);
  }, [form, model]);

  const submitOnChange = () => form.submit();

  const hasActiveFilters = Object.entries(model ?? {}).some(([key, value]) => {
    if (key === "pageIndex" || key === "pageSize") return false;
    if (typeof value === "boolean") return value;
    return isFilledValue(value);
  });

  const clearFilters = () => {
    form.resetFields();
    onSubmit({ pageIndex: 1, pageSize: model?.pageSize ?? 30 });
  };

  const submitDateFilter = (dateValues: Pick<INewsOpts, "fromDate" | "toDate">) => {
    // Không dùng form.submit ở đây: DatePicker cập nhật form trong chính event
    // chọn ngày, nên gọi trực tiếp với giá trị vừa chọn để URL/API luôn nhận đủ range.
    onSubmit({ ...form.getFieldsValue(), ...dateValues });
  };

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

  const clearSource = () => {
    setSourceLabel(undefined);
    form.setFieldValue("SourceType", undefined);
    form.submit();
  };

  const sourceField = (
    <FloatingField
      label="Nguồn"
      required
      filled={isFilledValue(sourceTypeWatch) || isFilledValue(sourceLabel) || sourceOpen}
    >
      <Dropdown
        menu={{
          items: sourceMenuItems,
          selectedKeys: sourceTypeWatch ? [sourceTypeWatch] : ["all"],
          onClick: ({ key }) => {
            if (key === "all") {
              clearSource();
              return;
            }
            const chosen = sourceMenuItems.find((item) => item.key === key);
            setSourceLabel(chosen?.label);
            form.setFieldValue("SourceType", key as "write" | "share");
            form.submit();
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
          {sourceLabel ? (
            <X
              size={14}
              className="news-source-dropdown-clear"
              onClick={(e) => {
                e.stopPropagation();
                clearSource();
              }}
            />
          ) : (
            <ChevronDown size={14} className="news-source-dropdown-icon" />
          )}
        </div>
      </Dropdown>
    </FloatingField>
  );

  const dateField = (
    <FloatingField label="Thời gian" required filled={isFilledValue(fromDateWatch)}>
      <Form.Item noStyle>
        <NewsDateFilter form={form} onValueChange={submitDateFilter} />
      </Form.Item>
    </FloatingField>
  );

  const statusField = (
    <FloatingField label="Trạng thái" required filled={isFilledValue(statusWatch)}>
      <Form.Item name="Status" noStyle>
        <NewsStatusSelect placeholder="Chọn" onChange={submitOnChange} />
      </Form.Item>
    </FloatingField>
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Bấm nút "x" (allowClear) hoặc tự xoá hết chữ trong ô tìm kiếm không bắn
    // sự kiện onPressEnter, nên trước đây danh sách không tự tải lại khi xoá.
    // Chỉ tự submit khi ô đã rỗng — vẫn giữ hành vi "gõ xong bấm Enter mới tìm"
    // để tránh gọi API liên tục theo từng kí tự gõ.
    if (!e.target.value) {
      submitOnChange();
    }
  };

  const searchField = (
    <div className="news-filter-search-field">
      <Form.Item name="search" noStyle>
        <Input
          placeholder="Tìm kiếm theo tiêu đề"
          prefix={<Search size={14} />}
          allowClear
          onChange={handleSearchChange}
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
          {hasActiveFilters && (
            <Col xs={24}>
              <button type="button" className="news-filter-clear-btn" onClick={clearFilters}>
                <RotateCcw size={14} />
                <span>Xóa bộ lọc</span>
              </button>
            </Col>
          )}
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
      <div className="news-filter-outer">
        <div className="news-filter-toolbar">
          <div className="news-filter-field news-filter-field--user">{authorField}</div>
          <div className="news-filter-field news-filter-field--source">{sourceField}</div>
          <div className="news-filter-field news-filter-field--date">{dateField}</div>
          <div className="news-filter-field news-filter-field--status">{statusField}</div>
          <div className="news-filter-field news-filter-field--search">{searchField}</div>
          {hasActiveFilters && (
            <button type="button" className="news-filter-clear-btn" onClick={clearFilters}>
              <RotateCcw size={14} />
              <span>Xóa bộ lọc</span>
            </button>
          )}
          {extra && <div className="news-filter-extra">{extra}</div>}
        </div>
      </div>
    </Form>
  );
};

export default NewsFilter;
