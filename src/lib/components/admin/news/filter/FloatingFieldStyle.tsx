const FLOATING_FIELD_CSS = `
  .news-filter-form { container-type: inline-size; width: 100%; min-width: 0; }
  .news-filter-outer {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1340px;
    padding: 16px;
    border: none;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: inset 0 0 0 1px #e5e5e5;
    box-sizing: border-box;
  }
  .news-filter-outer .news-filter-toolbar {
    padding-top: 0;
    margin-top: 0;
    width: 100%;
  }

  .news-filter-toolbar {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 8px;
    margin-top: 0;
    padding-top: 10px;
  }

  /* ── Filter fields sized for the 1440px news management frame. ── */
  .news-filter-field {
    flex: 0 0 200px;
    width: 200px;
    min-height: 40px;
    display: flex;
    align-items: center;
  }
  .news-filter-field--user,
  .news-filter-field--source,
  .news-filter-field--date,
  .news-filter-field--status {
    flex: 0 0 200px;
    width: 200px;
    max-width: 200px;
  }
  .news-filter-field--search {
    flex: 1 1 200px;
    min-width: 180px;
    width: 200px;
    max-width: 283px;
  }

  .news-filter-clear-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 10px;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    background: #ffffff;
    color: #0a0a0a;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;
  }
  .news-filter-clear-btn:hover {
    border-color: #0588f0;
    background: #e8f4fe;
    color: #0588f0;
  }

  /* ── Box chính: border/radius/height lấy theo .combobox trong index.css ── */
  .news-filter-floating-field {
    position: relative;
    display: flex;
    align-items: center;
    gap: 40px;
    width: 100%;
    height: 40px;
    min-height: 40px;
    padding: 0 12px;
    box-sizing: border-box;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    transition: border-color 0.18s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .news-filter-floating-field:hover {
    border-color: #bdbdbd;
    background: #ffffff;
  }
  .news-filter-floating-field:focus-within {
    border-color: #0588f0;
    box-shadow: 0 0 0 2px rgba(5, 136, 240, 0.12);
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

  /* Range date control: keep both booking-style inputs readable inside the field. */
  .news-filter-field--date .ant-picker-range {
    width: 100% !important;
    min-width: 0 !important;
    height: 100% !important;
    padding: 0 !important;
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
  .news-filter-field--date .ant-picker-range .ant-picker-input {
    flex: 1 1 0 !important;
    min-width: 0 !important;
    width: auto !important;
  }
  .news-filter-field--date .ant-picker-range .ant-picker-input > input {
    width: 100% !important;
    min-width: 0 !important;
    height: 24px !important;
    padding: 0 !important;
    line-height: 24px !important;
    text-align: center !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .news-filter-field--date .ant-picker-range-separator {
    flex: 0 0 20px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    color: #a1a1aa !important;
  }
  .news-filter-field--date .ant-picker-suffix {
    flex: 0 0 auto !important;
    margin-left: 4px !important;
  }
  .news-filter-field--date .news-filter-floating-field:not(.news-filter-floating-field--filled) .ant-picker-range-separator {
    visibility: hidden !important;
  }
  .news-filter-field--date .news-filter-floating-label {
    background: #ffffff;
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
    opacity: 1;
    transition: opacity 0.15s ease;
  }
  .news-source-dropdown--open .news-source-dropdown-text,
  .news-source-dropdown-text--filled {
    opacity: 1;
  }
  .news-source-dropdown-text--filled {
    color: #0a0a0a;
  }

  .news-filter-floating-field:not(.news-filter-floating-field--filled):not(:focus-within) .news-source-dropdown-text {
    opacity: 0;
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

  .news-source-dropdown-clear {
    flex-shrink: 0;
    color: #a3a3a3;
    font-size: 12px;
    transition: color 0.18s ease;
  }

  .news-source-dropdown-clear:hover {
    color: #ef4444;
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
  .news-filter-floating-field .ant-select-selection-placeholder,
  .news-filter-floating-field .ant-select-selection-item,
  .news-filter-floating-field .news-source-dropdown-text,
  .news-filter-floating-field .ant-picker-input > input {
    transform: none;
  }
  /* Giá trị đã chọn / đã nhập: chữ đậm màu #0a0a0a, khớp text trong ô của index.css */
  .news-filter-floating-field .ant-select-selection-item,
  .news-filter-floating-field .ant-picker-input > input {
    color: #0a0a0a !important;
    font-family: Inter, var(--default-font-family, sans-serif);
    font-weight: 500 !important;
  }
  .news-filter-floating-field .ant-select-selection-item {
    padding: 0 !important;
    min-height: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
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

  /* The idle label replaces Ant Design's duplicate placeholder. */
  .news-filter-floating-field:not(.news-filter-floating-field--filled):not(:focus-within) .ant-select-selection-placeholder,
  .news-filter-floating-field:not(.news-filter-floating-field--filled):not(:focus-within) .ant-picker-input > input::placeholder {
    color: transparent !important;
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


  .news-filter-floating-label {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    background: transparent;
    color: #a1a1aa;
    font-family: Inter, var(--default-font-family, sans-serif);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2;
    transition: top 0.18s ease, transform 0.18s ease, padding 0.18s ease,
      font-size 0.18s ease, color 0.18s ease, background-color 0.18s ease;
  }
  .news-filter-floating-label .required {
    color: #dc3e42;
    font-size: 10px;
    font-weight: 500;
    line-height: 12px;
  }

  .news-filter-floating-field--filled .news-filter-floating-label,
  .news-filter-floating-field:focus-within .news-filter-floating-label {
    top: -7px;
    transform: none;
    padding: 0 4px;
    background: #ffffff;
    color: #64748b;
    font-size: 10px;
    font-weight: 400;
    line-height: 12px;
  }
  .news-filter-floating-field--filled .news-filter-floating-label .required,
  .news-filter-floating-field:focus-within .news-filter-floating-label .required {
    font-size: 10px;
    line-height: 12px;
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

  /* ── Ô tìm kiếm: đồng bộ phong cách với các box phía trên (border e5e5e5, radius 10, height 40) ── */
  .news-filter-field--search .news-filter-search-field {
    min-width: 180px !important;
    max-width: 283px !important;
    width: 100% !important;
  }
  .news-filter-toolbar {
    align-items: center;
    min-height: 40px;
  }
  .news-filter-extra {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-left: auto;
    flex: 0 0 auto;
    min-height: 40px;
  }
  .news-filter-search-field {
    width: 100% !important;
    min-width: 0 !important;
  }
  .news-filter-search-field .ant-input-affix-wrapper {
    width: 100% !important;
    min-width: 0 !important;
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
    border-color: #bdbdbd;
  }
  .news-filter-search-field .ant-input-affix-wrapper-focused,
  .news-filter-search-field .ant-input-affix-wrapper:focus-within {
    border-color: #0588f0 !important;
    box-shadow: 0 0 0 2px rgba(5, 136, 240, 0.12) !important;
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

  .news-filter-extra {
    display: flex;
    align-items: center;
    margin-left: auto;
    flex: 0 0 auto;
  }

  /* Figma: menu 240 × 92, viền không làm tăng kích thước nội dung. */
  .news-source-menu.ant-dropdown .ant-dropdown-menu {
    width: 100%; padding: 8px; border-radius: 8px; border: none;
    background: #ffffff;
    box-shadow: inset 0 0 0 1px #e5e5e5, 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  }
  .news-source-menu.ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item {
    padding: 8px 12px; font-size: 14px; line-height: 20px; color: #0a0a0a;
    border-radius: 4px;
  }
  .news-source-menu.ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:hover { background: #f5f5f5 !important; color: #0a0a0a; }
  .news-source-menu.ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-selected { background: #ffffff !important; color: #0a0a0a !important; font-weight: 600; }
  .news-source-menu.ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item + .ant-dropdown-menu-item { margin-top: 4px; }

  @container (max-width: 1199px) {
    .news-filter-outer {
      align-items: stretch;
    }

    .news-filter-toolbar {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      min-width: 0;
    }

    .news-filter-field,
    .news-filter-field--user,
    .news-filter-field--source,
    .news-filter-field--date,
    .news-filter-field--status {
      flex: initial;
      width: 100%;
      max-width: none;
      min-width: 0;
    }

    .news-filter-field--search,
    .news-filter-clear-btn,
    .news-filter-extra {
      grid-column: 1 / -1;
      width: 100%;
      min-width: 0;
      max-width: none;
    }

    .news-filter-field--search .news-filter-search-field,
    .news-filter-search-field,
    .news-filter-search-field .ant-input-affix-wrapper {
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
    }

    .news-filter-extra {
      margin-left: 0;
    }

    .news-filter-extra > * {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 767px) {
    .news-filter-outer {
      align-items: stretch;
    }

    .news-filter-toolbar {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      min-width: 0;
    }

    .news-filter-field,
    .news-filter-field--user,
    .news-filter-field--source,
    .news-filter-field--date,
    .news-filter-field--status {
      flex: initial;
      width: 100%;
      max-width: none;
      min-width: 0;
    }

    .news-filter-field--search,
    .news-filter-clear-btn,
    .news-filter-extra {
      grid-column: 1 / -1;
      width: 100%;
      min-width: 0;
      max-width: none;
    }

    .news-filter-search-field,
    .news-filter-field--search .news-filter-search-field,
    .news-filter-search-field .ant-input-affix-wrapper {
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
    }

    .news-filter-extra {
      margin-left: 0;
    }

    .news-filter-extra > * {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 575px) {
    .news-filter-toolbar {
      grid-template-columns: minmax(0, 1fr);
    }

    .news-filter-field,
    .news-filter-field--search,
    .news-filter-clear-btn,
    .news-filter-extra {
      grid-column: 1;
    }
  }
  .news-filter-form .news-filter-create-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px;
    border-radius: 8px;
    background: #0588F0 !important;
    color: #fff;
    border: none !important;
    cursor: pointer;
    font-family: Inter, var(--default-font-family, sans-serif);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    white-space: nowrap;
    box-shadow: none !important;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .news-filter-form .news-filter-create-btn:hover {
    background: #0d74ce !important;
    border-color: #0d74ce !important;
  }
  .news-filter-form .news-filter-create-btn:active {
    background: #0d74ce !important;
    border-color: #0d74ce !important;
    transform: none;
  }
  .news-filter-create-btn .anticon {
    font-size: 14px;
  }

`;

const FloatingFieldStyle = () => <style>{FLOATING_FIELD_CSS}</style>;

export default FloatingFieldStyle;
