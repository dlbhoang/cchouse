import { Dropdown, Form, Input } from "antd";
import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { NewsStatusSelect, UserAdminSelect } from "@/lib/components/shared/MySelect";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";

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
  { key: "write", label: "Viết bài" },
  { key: "share", label: "Chia sẻ" },
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
  const [form] = Form.useForm<INewsOpts>();
  const [sourceOpen, setSourceOpen] = useState(false);
  // Nhãn đang được chọn trong dropdown "Nguồn" (Viết bài / Chia sẻ), hiển thị
  const [sourceLabel, setSourceLabel] = useState<string>();

  const createdByWatch = Form.useWatch("CreatedBy", form);
  const sourceTypeWatch = Form.useWatch("SourceType", form);
  const fromDateWatch = Form.useWatch("fromDate", form);
  const statusWatch = Form.useWatch("Status", form);

  useEffect(() => {
    if (!model) {
      return;
    }

    form.setFieldsValue({
      CreatedBy: undefined,
      Status: undefined,
      search: undefined,
      SourceType: undefined,
      fromDate: undefined,
      toDate: undefined,
      ...model,
    });
    setSourceLabel(sourceMenuItems.find((item) => item.key === model?.SourceType)?.label);
  }, [form, model]);

  const submitOnChange = () => form.submit();

  const submitDateFilter = (dateValues: Pick<INewsOpts, "fromDate" | "toDate">) => {
    // Không dùng form.submit ở đây: DatePicker cập nhật form trong chính event
    // chọn ngày, nên gọi trực tiếp với giá trị vừa chọn để URL/API luôn nhận đủ range.
    onSubmit({ ...form.getFieldsValue(), ...dateValues });
  };

  const handleSourceOpenChange = (open: boolean) => setSourceOpen(open);

  const authorField = (
    <FloatingField label="Người đăng" required filled={isFilledValue(createdByWatch)}>
      <Form.Item name="CreatedBy" noStyle>
        <UserAdminSelect valueAsName suffixIcon={<ChevronDown size={16} />} placeholder="Chọn" onChange={submitOnChange} />
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
          selectedKeys: sourceTypeWatch ? [sourceTypeWatch] : [],
          onClick: ({ key }) => {
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
          <div style={{ width: 240, maxWidth: "calc(100vw - 32px)" }}>{menu}</div>
        )}
      >
        <div
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
            <ChevronDown size={16} className="news-source-dropdown-icon" />
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
        <NewsStatusSelect suffixIcon={<ChevronDown size={16} />} placeholder="Chọn" onChange={submitOnChange} />
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
          prefix={<Search size={16} />}
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
          {extra && <div className="news-filter-extra">{extra}</div>}
        </div>
      </div>
    </Form>
  );
};

export default NewsFilter;
