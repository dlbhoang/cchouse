import { Col, DatePicker, Form, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, type ReactNode } from "react";

import { NewsTypeSelect, StatusBaseSelect, UserAdminSelect } from "@/lib/components/shared/MySelect";
import { appConst } from "@/lib/core/configs/appConst";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import { INewsOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";

const hiddenFields = ["IsWebsite", "pageSize", "pageIndex", "fromDate", "toDate"];

type Props = {
  model?: INewsOpts;
  onSubmit: (values: INewsOpts) => void;
  extra?: ReactNode;
};

const isFilledValue = (value: unknown) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== "";
};

const FLOATING_FIELD_CSS = `
  .news-filter-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 8px;
    margin-top: -20px;
  }

  /* ── Khung field bọc ngoài: cố định width nhỏ gọn ── */
  .news-filter-field {
    flex: 0 0 160px;
    width: 160px;
  }
  .news-filter-field--user {
    flex: 0 0 160px;
    width: 160px;
    max-width: 160px;
  }
  .news-filter-field--source {
    flex: 0 0 160px;
    width: 160px;
    max-width: 160px;
  }
  .news-filter-field--date {
    flex: 0 0 160px;
    width: 160px;
    max-width: 160px;
  }
  .news-filter-field--status {
    flex: 0 0 160px;
    width: 160px;
    max-width: 160px;
  }
  .news-filter-field--search {
    flex: 0 0 200px;
    width: 200px;
    max-width: 200px;
  }

  /* ── Box chính ── */
  .news-filter-floating-field {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    width: 160px;
    height: 32px;
    padding: 6px 10px;
    box-sizing: border-box;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    box-shadow: 0 1px 2px rgba(16, 16, 16, 0.03);
    transition: border-color 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .news-filter-floating-field:hover {
    border-color: #c2c2c2;
    box-shadow: 0 1px 4px rgba(16, 16, 16, 0.06);
  }
  .news-filter-floating-field:focus-within {
    border-color: #0588f0;
    box-shadow: 0 0 0 3px rgba(5, 136, 240, 0.14);
  }

  /* ── Triệt tiêu toàn bộ border/shadow gốc của antd ở MỌI trạng thái,
     để box ngoài là nơi duy nhất thể hiện viền/hover/focus ── */
  .news-filter-floating-field .ant-select,
  .news-filter-floating-field .ant-picker,
  .news-filter-floating-field .ant-input-affix-wrapper,
  .news-filter-floating-field > .ant-input {
    width: 100%;
  }
  .news-filter-floating-field .ant-select-selector,
  .news-filter-floating-field .ant-select-selector:hover,
  .news-filter-floating-field .ant-select-focused .ant-select-selector,
  .news-filter-floating-field .ant-select-open .ant-select-selector,
  .news-filter-floating-field .ant-picker,
  .news-filter-floating-field .ant-picker:hover,
  .news-filter-floating-field .ant-picker-focused,
  .news-filter-floating-field .ant-input-affix-wrapper,
  .news-filter-floating-field .ant-input-affix-wrapper:hover,
  .news-filter-floating-field .ant-input-affix-wrapper-focused,
  .news-filter-floating-field > .ant-input,
  .news-filter-floating-field > .ant-input:hover,
  .news-filter-floating-field > .ant-input:focus {
    min-height: unset !important;
    height: 100% !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
  }
  .news-filter-floating-field .ant-select-selection-search-input {
    box-shadow: none !important;
  }

  /* Icon mũi tên / clear trong Select, DatePicker — nhạt khi nghỉ, đậm dần khi hover/focus */
  .news-filter-floating-field .ant-select-arrow,
  .news-filter-floating-field .ant-select-clear,
  .news-filter-floating-field .ant-picker-suffix,
  .news-filter-floating-field .ant-picker-clear {
    color: #a3a3a3;
    transition: color 0.18s ease;
  }
  .news-filter-floating-field:hover .ant-select-arrow,
  .news-filter-floating-field:focus-within .ant-select-arrow,
  .news-filter-floating-field:hover .ant-picker-suffix,
  .news-filter-floating-field:focus-within .ant-picker-suffix {
    color: #0588f0;
  }

  /* ── Label nổi: mặc định nằm GIỮA box, làm placeholder ── */
  .news-filter-floating-label {
    position: absolute !important;
    left: 10px;
    top: 50% !important;
    transform: translateY(-50%) !important;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 0 3px;
    background: #ffffff;
    color: #8a8a8a;
    font-size: 12px !important;
    font-weight: 400;
    line-height: 1;
    pointer-events: none;
    z-index: 1;
    transition: top 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1), color 0.18s ease;
  }
  .news-filter-floating-label .required {
    color: #0588f0;
    font-size: 11px;
    line-height: 1;
  }

  /* Chỉ khi bấm vào (focus) hoặc đã có giá trị (filled) label mới nổi lên trên viền */
  .news-filter-floating-field--filled .news-filter-floating-label,
  .news-filter-floating-field:focus-within .news-filter-floating-label {
    top: 0 !important;
    transform: translateY(-50%) !important;
    font-size: 10px !important;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: #525252;
  }
  .news-filter-floating-field:focus-within .news-filter-floating-label {
    color: #0588f0;
  }

  .news-filter-floating-field--error {
    border-color: #ef4444;
  }
  .news-filter-floating-field--error:hover,
  .news-filter-floating-field--error:focus-within {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
  .news-filter-floating-field--error .news-filter-floating-label {
    color: #ef4444;
  }

  /* Ẩn text mặc định bên trong control (vd chữ "Chọn") khi box chưa có giá trị và chưa focus,
     để chỉ còn label nổi đóng vai trò placeholder — không phụ thuộc component con có nhận
     đúng prop placeholder hay không. */
  .news-filter-floating-field:not(.news-filter-floating-field--filled):not(:focus-within)
    .ant-select-selection-item,
  .news-filter-floating-field:not(.news-filter-floating-field--filled):not(:focus-within)
    .ant-select-selection-placeholder,
  .news-filter-floating-field:not(.news-filter-floating-field--filled):not(:focus-within)
    .ant-picker-input
    > input {
    opacity: 0 !important;
  }

  /* ── Ô tìm kiếm: đồng bộ phong cách với các box phía trên ── */
  .news-filter-search-field {
    flex: 0 0 200px;
    width: 200px;
    max-width: 200px;
  }
  .news-filter-search-field .ant-input-affix-wrapper {
    width: 100% !important;
    height: 32px !important;
    min-height: 32px !important;
    max-height: 32px !important;
    box-sizing: border-box !important;
    border-radius: 8px !important;
    border: 1px solid #e5e5e5 !important;
    background: #ffffff !important;
    padding: 0 10px !important;
    display: flex !important;
    align-items: center !important;
    box-shadow: 0 1px 2px rgba(16, 16, 16, 0.03) !important;
    transition: border-color 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .news-filter-search-field .ant-input-affix-wrapper:hover {
    border-color: #c2c2c2;
    box-shadow: 0 1px 4px rgba(16, 16, 16, 0.06) !important;
  }
  .news-filter-search-field .ant-input-affix-wrapper-focused,
  .news-filter-search-field .ant-input-affix-wrapper:focus-within {
    border-color: #0588f0 !important;
    box-shadow: 0 0 0 3px rgba(5, 136, 240, 0.14) !important;
  }
  .news-filter-search-field .ant-input {
    font-size: 13px !important;
    height: 100% !important;
    padding: 0 !important;
    line-height: 1 !important;
  }
  .news-filter-search-field .ant-input-prefix {
    color: #a3a3a3;
    margin-right: 6px;
    line-height: 1;
    display: flex;
    align-items: center;
    transition: color 0.18s ease;
  }
  .news-filter-search-field .ant-input-affix-wrapper:focus-within .ant-input-prefix {
    color: #0588f0;
  }
  .news-filter-search-field .ant-input-clear-icon {
    color: #a3a3a3;
  }

  /* ── Slot cho nội dung phụ (vd nút "Viết bài") cùng hàng với các field lọc ── */
  .news-filter-extra {
    display: flex;
    align-items: center;
    margin-left: auto;
    flex: 0 0 auto;
  }

  /* ── Responsive: dưới 576px (mobile), field full-width, dùng layout Row/Col đã có ── */
  @media (max-width: 575px) {
    .news-filter-field--user,
    .news-filter-field--source,
    .news-filter-field--date,
    .news-filter-field--status {
      max-width: none;
    }

    .news-filter-extra {
      margin-left: 0;
      width: 100%;
    }

    .news-filter-extra > * {
      width: 100%;
      justify-content: center;
    }
  }
`;

const FloatingFieldStyle = () => <style>{FLOATING_FIELD_CSS}</style>;

const FloatingField = ({
  label,
  required,
  filled,
  children,
}: {
  label: string;
  required?: boolean;
  filled?: boolean;
  children: ReactNode;
}) => (
  <div
    className={[
      "news-filter-floating-field",
      filled ? "news-filter-floating-field--filled" : "",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
    <span className="news-filter-floating-label">
      {label}
      {required && <span className="required">*</span>}
    </span>
  </div>
);

const NewsDateFilter = ({
  form,
  onValueChange,
}: {
  form: ReturnType<typeof Form.useForm<INewsOpts>>[0];
  onValueChange?: () => void;
}) => {
  const fromDateWatch = Form.useWatch("fromDate", form);

  const presetDays = [3, 7, 30];

  const setPreset = (days: number) => {
    const date = dayjs().subtract(days, "day");
    const formatted = date.format(appConst.SUBMIT_DATE_FORMAT);

    form.setFieldValue("fromDate", formatted);
    form.setFieldValue("toDate", formatted);

    onValueChange?.();
  };

  return (
    <>
      <DatePicker
        popupClassName="news-date-picker-popup"
        value={fromDateWatch ? dayjs(fromDateWatch) : null}
        format={appConst.DATE_FORMAT}
        placeholder=""
        allowClear
        onChange={(date) => {
          if (!date) {
            form.setFieldValue("fromDate", undefined);
            form.setFieldValue("toDate", undefined);
          } else {
            const formatted = date.format(appConst.SUBMIT_DATE_FORMAT);

            form.setFieldValue("fromDate", formatted);
            form.setFieldValue("toDate", formatted);
          }

          onValueChange?.();
        }}
        panelRender={(panel) => (
          <div className="news-date-picker-wrapper">
            <div className="news-date-picker-presets">
              {presetDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setPreset(day)}
                >
                  {day} ngày trước
                </button>
              ))}
            </div>

            {panel}
          </div>
        )}
      />

      <style>{`
        .news-date-picker-popup {
          padding: 0 !important;
          border-radius: 10px !important;
          overflow: hidden !important;
        }

        .news-date-picker-wrapper {
          width: 240px;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
        }

        /* Fix khoảng trắng / hở góc */
        .news-date-picker-popup .ant-picker-panel-layout,
        .news-date-picker-popup .ant-picker-date-panel,
        .news-date-picker-popup .ant-picker-body {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        /* Presets */
        .news-date-picker-presets {
          display: flex;
          gap: 6px;
          padding: 8px;
          border-bottom: 1px solid #f3f4f6;
        }

        .news-date-picker-presets button {
          flex: 1;
          border: none;
          background: #f3f4f6;
          padding: 5px 6px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          line-height: 1.3;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .news-date-picker-presets button:hover {
          background: #e6f4ff;
          color: #1677ff;
        }

        /* Calendar panel */
        .news-date-picker-popup .ant-picker-panel {
          border: none !important;
          box-shadow: none !important;
        }

        .news-date-picker-popup .ant-picker-header {
          padding: 6px 8px;
          border-bottom: none;
        }

        .news-date-picker-popup .ant-picker-header-view {
          font-size: 12px;
        }

        .news-date-picker-popup .ant-picker-content {
          width: 100%;
        }

        /* Weekday */
        .news-date-picker-popup .ant-picker-content th {
          color: #9ca3af;
          font-weight: 500;
          font-size: 11px;
          padding-bottom: 4px;
        }

        /* Day cell */
        .news-date-picker-popup .ant-picker-cell {
          padding: 1px 0;
        }

        .news-date-picker-popup .ant-picker-cell-inner {
          width: 22px;
          height: 22px;
          line-height: 22px;
          font-size: 12px;
          border-radius: 6px !important;
        }

        .news-date-picker-popup
          .ant-picker-cell-selected
          .ant-picker-cell-inner {
          background: #2563eb !important;
          color: white !important;
        }

        .news-date-picker-popup
          .ant-picker-cell:hover
          .ant-picker-cell-inner {
          background: #dbeafe !important;
        }

        /* Remove today border */
        .news-date-picker-popup
          .ant-picker-cell-today
          .ant-picker-cell-inner::before {
          display: none !important;
        }

        /* Body spacing */
        .news-date-picker-popup .ant-picker-body {
          padding: 6px 8px !important;
        }

        /* Footer */
        .news-date-picker-popup .ant-picker-footer {
          border-top: none !important;
          padding: 4px 0;
        }
      `}</style>
    </>
  );
};

const NewsFilter = ({ model, onSubmit, extra }: Props) => {
  const { smallScreen } = useAdminContext();
  const [form] = Form.useForm<INewsOpts>();

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

  const authorField = (
    <FloatingField
      label="Người đăng"
      required
      filled={isFilledValue(createdByWatch)}
    >
      <Form.Item name="CreatedBy" noStyle>
        <UserAdminSelect placeholder="" onChange={submitOnChange} />
      </Form.Item>
    </FloatingField>
  );

  const sourceField = (
    <FloatingField
      label="Nguồn"
      required
      filled={isFilledValue(newsTypeIdsWatch)}
    >
      <Form.Item name="NewsTypeIds" noStyle>
        <NewsTypeSelect placeholder="" onChange={submitOnChange} />
      </Form.Item>
    </FloatingField>
  );

  const dateField = (
    <FloatingField
      label="Thời gian"
      required
      filled={isFilledValue(fromDateWatch)}
    >
      <Form.Item noStyle>
        <NewsDateFilter form={form} onValueChange={submitOnChange} />
      </Form.Item>
    </FloatingField>
  );

  const statusField = (
    <FloatingField
      label="Trạng thái"
      required
      filled={isFilledValue(statusWatch)}
    >
      <Form.Item name="Status" noStyle>
        <StatusBaseSelect placeholder="" onChange={submitOnChange} />
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