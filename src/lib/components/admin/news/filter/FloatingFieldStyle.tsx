import React from "react";

const FLOATING_FIELD_CSS = `
  .news-filter-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 0;
    padding-top: 10px;
  }

  /* ── Khung field bọc ngoài: cố định width nhỏ gọn, khớp .combobox (201px) trong index.css ── */
  .news-filter-field {
    flex: 0 0 201px;
    width: 201px;
    min-height: 40px;
    display: flex;
    align-items: center;
  }
  .news-filter-field--user,
  .news-filter-field--source,
  .news-filter-field--date,
  .news-filter-field--status {
    flex: 0 0 201px;
    width: 201px;
    max-width: 201px;
  }
  .news-filter-field--search {
    flex: 1 1 280px;
    min-width: 280px;
    width: 280px;
    max-width: 420px;
  }

  /* ── Box chính: border/radius/height lấy theo .combobox trong index.css ── */
  .news-filter-floating-field {
    position: relative;
    display: flex;
    align-items: center;
    gap: 40px;
    width: 201px;
    height: 40px;
    min-height: 40px;
    padding: 12px;
    box-sizing: border-box;
    border-radius: 10px;
    background: var(--Text-White, #fff);
    border: 1px solid var(--Text-Border, #e5e5e5);
    transition: border-color 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .news-filter-floating-field:hover {
    border-color: #c7c7cc;
  }
  .news-filter-floating-field:focus-within {
    border-color: #0588f0;
    box-shadow: 0 0 0 3px rgba(5, 136, 240, 0.12);
  }

  /* ── Triệt tiêu toàn bộ border/shadow gốc của antd ở MỌI trạng thái,
     để box ngoài là nơi duy nhất thể hiện viền/hover/focus ── */
  .news-filter-floating-field .ant-select,
  .news-filter-floating-field .ant-picker,
  .news-filter-floating-field .ant-input-affix-wrapper,
  .news-filter-floating-field > .ant-input {
    width: 100%;
    height: 100%;
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
    flex-wrap: nowrap !important;
  }
  .news-filter-floating-field .ant-select-selector,
  .news-filter-floating-field .ant-picker {
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
  }
  .news-filter-floating-field .ant-select-selector {
    padding: 0 !important;
    gap: 8px !important;
    border-radius: 10px !important;
    background: transparent !important;
  }
  .news-filter-floating-field .ant-select-selection-wrap {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    flex-wrap: wrap !important;
    overflow: hidden !important;
    width: 100% !important;
  }
  .news-filter-floating-field .ant-select-selection-overflow {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    flex-wrap: wrap !important;
    overflow: hidden !important;
    width: 100% !important;
  }

  /* ── Ô "Nguồn" (custom dropdown trigger): input-body flex space-between,
     giống combobox-1 trong index.jsx (text bên trái + chevron bên phải) ── */
  .news-source-dropdown {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: transparent;
    user-select: none;
  }

  .news-source-dropdown-text {
    display: block;
    flex: 1 1 0;
    min-width: 0;
    font-family: Inter, var(--default-font-family, sans-serif);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #a1a1aa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0; /* mặc định ẩn, chỉ hiện khi bấm vào (mở dropdown) hoặc đã chọn giá trị */
    transition: opacity 0.15s ease;
  }
  .news-source-dropdown--open .news-source-dropdown-text,
  .news-source-dropdown-text--filled {
    opacity: 1;
  }
  .news-source-dropdown-text--filled {
    color: #0a0a0a;
  }

  .news-source-dropdown-icon {
    flex-shrink: 0;
    color: #a3a3a3;
    font-size: 12px;
    transition: color 0.18s ease, transform 0.18s ease;
  }

  .news-filter-floating-field:hover .news-source-dropdown-icon {
    color: #0588f0;
  }

  .news-source-dropdown--open .news-source-dropdown-icon {
    color: #0588f0;
    transform: rotate(180deg);
  }

  .news-filter-floating-field .ant-select-selection-overflow-item {
    display: inline-flex !important;
    align-items: center !important;
    max-width: 100% !important;
    margin: 2px 2px 2px 0 !important;
  }
  .news-filter-floating-field .ant-select-selection-item,
  .news-filter-floating-field .ant-select-selection-item-content,
  .news-filter-floating-field .ant-picker-input > input,
  .news-filter-floating-field .ant-select-selection-search-mirror {
    line-height: 1.4 !important;
    font-size: 14px !important;
  }
  /* Giá trị đã chọn / đã nhập: chữ đậm màu #0a0a0a, khớp text trong ô của index.css */
  .news-filter-floating-field .ant-select-selection-item,
  .news-filter-floating-field .ant-picker-input > input {
    color: #0a0a0a !important;
    font-family: Inter, var(--default-font-family, sans-serif);
    font-weight: 500 !important;
  }
  .news-filter-floating-field .ant-select-selection-item {
    padding: 4px 10px !important;
    min-height: 28px !important;
    border-radius: 12px !important;
    background: rgba(15, 23, 42, 0.04) !important;
    border: none !important;
    display: inline-flex !important;
    align-items: center !important;
  }
  .news-filter-floating-field .ant-select-selection-item-remove {
    margin-left: 6px !important;
    color: #94a3b8 !important;
  }
  .news-filter-floating-field .ant-select-selection-overflow-item-rest .ant-select-selection-item {
    background: transparent !important;
    color: #111827 !important;
    border-color: transparent !important;
  }
  .news-filter-floating-field .ant-select-selection-search {
    min-width: 24px !important;
    max-width: 100% !important;
    align-items: center !important;
  }
  .news-filter-floating-field .ant-select-selection-search-input {
    box-shadow: none !important;
    font-size: 14px !important;
    opacity: 1 !important;
    min-width: 20px !important;
    width: auto !important;
    min-height: 22px !important;
  }
  .news-filter-floating-field .ant-select-selection-overflow-item-suffix {
    position: static !important;
    width: auto !important;
  }
  /* Placeholder mặc định (vd "Chọn", "Chọn ngày"): màu nhạt #a1a1aa, khớp .content trong index.css */
  .news-filter-floating-field .ant-select-selection-placeholder,
  .news-filter-floating-field .ant-picker-input > input::placeholder {
    color: #a1a1aa !important;
    font-family: Inter, var(--default-font-family, sans-serif);
    font-weight: 500 !important;
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

  /* ── Label nổi kiểu Google/Material: mặc định nằm GIỮA box, đóng vai trò placeholder;
     khi bấm vào (focus) hoặc đã có giá trị (filled) thì mới bay lên viền trên, thu nhỏ lại,
     có nền trắng để "cắt" đường viền phía sau — giống .search-frame-title trong index.css
     nhưng chỉ áp dụng khi tương tác, không cố định như trước ── */
  .news-filter-floating-label {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 4px;
    background: transparent;
    color: #a1a1aa;
    font-family: Inter, var(--default-font-family, sans-serif);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2;
    transition: top 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      font-size 0.18s cubic-bezier(0.4, 0, 0.2, 1), color 0.18s ease,
      background-color 0.18s ease;
  }
  .news-filter-floating-label .required {
    color: #dc3e42;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  /* Chỉ khi bấm vào (focus) hoặc đã có giá trị (filled), label mới nổi lên trên viền */
  .news-filter-floating-field--filled .news-filter-floating-label,
  .news-filter-floating-field:focus-within .news-filter-floating-label {
    top: 0;
    transform: translateY(-50%);
    background: #ffffff;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #737373;
  }
  .news-filter-floating-field--filled .news-filter-floating-label .required,
  .news-filter-floating-field:focus-within .news-filter-floating-label .required {
    font-size: 10px;
    line-height: 16px;
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

  /* ── Ô tìm kiếm: đồng bộ phong cách với các box phía trên (border e5e5e5, radius 10, height 40) ── */
  .news-filter-field--search .news-filter-search-field {
    min-width: 280px !important;
    width: 100% !important;
  }
  .news-filter-toolbar {
    align-items: center;
    min-height: 52px;
  }
  .news-filter-extra {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 10px;
    background: var(--Brand-Main, #0588F0);
    margin-left: auto;
    flex: 0 0 auto;
    min-height: 40px;
  }
  .news-filter-search-field {
    width: 100% !important;
    min-width: 280px !important;
  }
  .news-filter-search-field .ant-input-affix-wrapper {
    width: 100% !important;
    min-width: 280px !important;
    height: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;
    box-sizing: border-box !important;
    border-radius: 10px !important;
    border: 1px solid #e5e5e5 !important;
    background: #ffffff !important;
    padding: 0 14px !important;
    display: flex !important;
    align-items: center !important;
    transition: border-color 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .news-filter-search-field .ant-input-affix-wrapper:hover {
    border-color: #c7c7cc;
  }
  .news-filter-search-field .ant-input-affix-wrapper-focused,
  .news-filter-search-field .ant-input-affix-wrapper:focus-within {
    border-color: #0588f0 !important;
    box-shadow: 0 0 0 3px rgba(5, 136, 240, 0.12) !important;
  }
  .news-filter-search-field .ant-input {
    font-size: 14px !important;
    font-weight: 500 !important;
    height: 100% !important;
    padding: 0 !important;
    line-height: 1 !important;
    color: #0a0a0a !important;
  }
  .news-filter-search-field .ant-input::placeholder {
    color: #a1a1aa !important;
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

  /* ── Menu dropdown "Nguồn": width được ép khớp chính xác với ô trigger qua inline style,
     nên ở đây chỉ set style trang trí, không set width cố định để tránh lệch/hở 2 bên ── */
  .news-source-menu .ant-dropdown-menu {
    width: 100%;
    padding: 6px;
    border-radius: 12px;
    box-shadow: 0 12px 28px rgba(16, 16, 16, 0.12);
    border: 1px solid #eef2f6;
  }

  .news-source-menu .ant-dropdown-menu-item {
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 14px;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .news-source-menu .ant-dropdown-menu-item .anticon {
    font-size: 15px;
    color: #94a3b8;
    transition: color 0.15s ease;
  }

  .news-source-menu .ant-dropdown-menu-item:hover {
    background: rgba(5, 136, 240, 0.08) !important;
    color: #0588f0;
  }

  .news-source-menu .ant-dropdown-menu-item:hover .anticon {
    color: #0588f0;
  }

  .news-source-menu .ant-dropdown-menu-item + .ant-dropdown-menu-item {
    margin-top: 2px;
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

export default FloatingFieldStyle;