import { useEffect, useRef } from "react";

// ── SVG Icons ──────────────────────────────────────────────

const HistoryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M0.00233531 4.40043L0.655636 1.12878C0.67405 1.03587 0.790673 1.00097 0.858725 1.06789L1.71004 1.9051C2.959 0.676586 4.62001 0 6.38643 0C8.15285 0 9.81385 0.676586 11.0631 1.9051C12.3465 3.16746 13.0342 4.8458 12.9987 6.63122C12.9635 8.41559 12.2085 10.0674 10.8731 11.2826C9.6145 12.4276 8.00046 13 6.38643 13C4.77239 13 3.15195 12.4252 1.89258 11.2763C1.16963 10.6167 0.618007 9.83097 0.252928 8.94075C0.128566 8.63789 0.27748 8.29329 0.585449 8.17126C0.893685 8.04869 1.24382 8.1954 1.36792 8.49826C1.66654 9.22576 2.11809 9.86876 2.71028 10.4091C4.76892 12.2872 7.99539 12.2893 10.0564 10.4144C11.1495 9.41997 11.7676 8.06811 11.7964 6.60813C11.8253 5.14735 11.2627 3.77397 10.2126 2.74125C9.19044 1.73608 7.8318 1.18258 6.38643 1.18258C4.94105 1.18258 3.58214 1.73608 2.56003 2.74125L3.53224 3.69734C3.60029 3.76426 3.5648 3.87869 3.47033 3.89706L0.14351 4.53953C0.0597128 4.5558 -0.0142107 4.48284 0.00233531 4.40043Z" fill="#3E3E3E"/>
    <path d="M5.77778 3.61111H6.5V7.22222H5.77778V3.61111Z" fill="#3E3E3E"/>
    <path d="M9.43103 7.64321L9.21117 8.33116L5.77145 7.23186L5.99131 6.54392L9.43103 7.64321Z" fill="#3E3E3E"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M5.49436 0C2.46455 0 0 2.44194 0 5.44349C0 6.68141 0.881811 8.56374 2.62282 11.0339C3.89466 12.84 5.18629 14.3238 5.1976 14.3379C5.34174 14.5018 5.59045 14.5188 5.75721 14.3746C5.77134 14.3633 5.78264 14.3492 5.79395 14.3379C5.80808 14.3238 7.09688 12.84 8.36872 11.0339C10.1097 8.56656 10.9915 6.68424 10.9915 5.44349C10.9915 2.44194 8.52417 0 5.49436 0ZM7.72432 10.5704C6.83969 11.8281 5.94374 12.9247 5.49436 13.4646C5.04497 12.9276 4.14903 11.8281 3.2644 10.5704C1.64492 8.27263 0.791369 6.50053 0.791369 5.44349C0.791369 2.87719 2.8998 0.791369 5.49436 0.791369C8.08892 0.791369 10.2002 2.87719 10.2002 5.44349C10.2002 6.50053 9.3438 8.27263 7.72432 10.5704Z" fill="#3E3E3E"/>
    <path d="M5.49436 2.97894C4.1236 2.97894 3.01003 4.08403 3.01003 5.44066C3.01003 6.79729 4.1236 7.90238 5.49436 7.90238C6.86512 7.90238 7.97869 6.79729 7.97869 5.44066C7.97869 4.08403 6.86512 2.97894 5.49436 2.97894ZM5.49436 7.11384C4.56167 7.11384 3.8014 6.36486 3.8014 5.44349C3.8014 4.52211 4.56167 3.77313 5.49436 3.77313C6.42704 3.77313 7.18732 4.52211 7.18732 5.44349C7.18732 6.36486 6.42704 7.11384 5.49436 7.11384Z" fill="#3E3E3E"/>
  </svg>
);

const ListIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11.5" cy="11.5" r="11.5" fill="#2563EB"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M4.79816 7.799C4.79816 7.46788 5.06659 7.19946 5.39769 7.19946H11.7928C12.1239 7.19946 12.3923 7.46788 12.3923 7.799C12.3923 8.1301 12.1239 8.39853 11.7928 8.39853H5.39769C5.06659 8.39853 4.79816 8.1301 4.79816 7.799Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M4.79816 10.9965C4.79816 10.6654 5.06659 10.397 5.39769 10.397H11.7928C12.1239 10.397 12.3923 10.6654 12.3923 10.9965C12.3923 11.3276 12.1239 11.596 11.7928 11.596H5.39769C5.06659 11.596 4.79816 11.3276 4.79816 10.9965Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M4.79816 14.194C4.79816 13.8629 5.06659 13.5945 5.39769 13.5945H11.7928C12.1239 13.5945 12.3923 13.8629 12.3923 14.194C12.3923 14.5251 12.1239 14.7936 11.7928 14.7936H5.39769C5.06659 14.7936 4.79816 14.5251 4.79816 14.194Z" fill="white"/>
    <circle cx="3.299" cy="10.9965" r="0.799" fill="white"/>
    <circle cx="3.299" cy="7.799" r="0.799" fill="white"/>
    <circle cx="3.299" cy="14.194" r="0.799" fill="white"/>
  </svg>
);

// ── Types ──────────────────────────────────────────────────

export type SearchSuggestionItem = {
  type: "history" | "location";
  label: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (item: SearchSuggestionItem) => void;
  recentItems?: SearchSuggestionItem[];
  suggestionItems?: SearchSuggestionItem[];
  onSelectArea?: () => void;
};

// ── Default mock data (theo Figma) ─────────────────────────

const DEFAULT_RECENT: SearchSuggestionItem[] = [
  { type: "history", label: "Bà Lê Chân, Quận 1, Hồ Chí Minh" },
  { type: "history", label: "Nhà phố, Dưới 100m²" },
  { type: "history", label: "Nhà phố, Đường Trần Bình Trọng, Phường Chợ Quán, Q..." },
  { type: "history", label: "Nhà phố, hướng Tây Nam" },
  { type: "history", label: "Bà Lê Chân, Quận 1, Hồ Chí Minh" },
];

const DEFAULT_SUGGESTIONS: SearchSuggestionItem[] = [
  { type: "location", label: "Bà Lê Chân, Quận 1, Hồ Chí Minh" },
  { type: "location", label: "Bùi Thị Xuân, Quận 1, Hồ Chí Minh" },
  { type: "location", label: "Cách Mạng Tháng 8, Quận 1, Hồ Chí Minh" },
  { type: "location", label: "Calmette, Quận 1, Hồ Chí Minh" },
  { type: "location", label: "Alexander de Rhodes, Quận 1, Hồ Chí Minh" },
];

// ── Component ──────────────────────────────────────────────

export const SearchSuggestionDropdown = ({
  open,
  onClose,
  onSelect,
  recentItems = DEFAULT_RECENT,
  suggestionItems = DEFAULT_SUGGESTIONS,
  onSelectArea,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // Click outside để đóng
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const ROW_H = 32;
  const HEADER_TOP = 24;
  const LIST_TOP = 53;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "#ffffff",
        borderRadius: 15,
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.20)",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ── Main content area ── */}
      <div style={{ display: "flex", padding: "24px 0 0 0" }}>

        {/* ── Cột trái: Xem gần đây ── */}
        <div style={{ flex: 1, padding: "0 24px 16px 24px", borderRight: "1px solid #ECECEC" }}>
          <div style={{ fontSize: 13, color: "#3E3E3E", marginBottom: 8, fontWeight: 400 }}>
            Xem gần đây
          </div>
          {recentItems.map((item, i) => (
            <div
              key={i}
              onClick={() => { onSelect(item); onClose(); }}
              style={{
                height: ROW_H,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 8px",
                borderRadius: 5,
                background: i === 0 ? "#F5F5F5" : "#ffffff",
                cursor: "pointer",
                marginBottom: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
              onMouseLeave={e => (e.currentTarget.style.background = i === 0 ? "#F5F5F5" : "#ffffff")}
            >
              <HistoryIcon />
              <span style={{ fontSize: 12, color: "#3E3E3E", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Divider dọc scrollbar style ── */}
        <div style={{ width: 4, background: "#D9D9D9", borderRadius: 50, margin: "0 0 0 0", alignSelf: "flex-start", height: recentItems.length * ROW_H, marginTop: 29 }} />

        {/* ── Cột phải: Gợi ý tìm kiếm ── */}
        <div style={{ flex: 1.3, padding: "0 24px 16px 24px" }}>
          <div style={{ fontSize: 13, color: "#3E3E3E", marginBottom: 8, fontWeight: 400 }}>
            Gợi ý tìm kiếm
          </div>
          {suggestionItems.map((item, i) => (
            <div
              key={i}
              onClick={() => { onSelect(item); onClose(); }}
              style={{
                height: ROW_H,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 8px",
                borderRadius: 5,
                background: i === 0 ? "#F5F5F5" : "#ffffff",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
              onMouseLeave={e => (e.currentTarget.style.background = i === 0 ? "#F5F5F5" : "#ffffff")}
            >
              <LocationIcon />
              <span style={{ fontSize: 12, color: "#3E3E3E", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ngang ── */}
      <div style={{ height: 1, background: "#ECECEC", margin: "0 0" }} />

      {/* ── Footer: Chọn khu vực ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 24px 12px 24px",
          cursor: "pointer",
        }}
        onClick={onSelectArea}
      >
        <ListIcon />
        <span
          style={{
            fontSize: 12,
            color: "#3B82F6",
            fontWeight: 600,
          }}
        >
          Chọn khu vực (thành phố, quận huyện, phường, xã...
        </span>
      </div>
    </div>
  );
};
