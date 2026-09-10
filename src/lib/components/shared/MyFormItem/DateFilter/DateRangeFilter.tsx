// DateRangeFilter.tsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dayjs, { Dayjs } from "dayjs";

export type DateRangeFilterProps = {
  fromDate?: string | null;
  toDate?: string | null;
  onChange?: (range: { fromDate?: string; toDate?: string }) => void;
  placeholder?: [string, string];
  format?: string;
};

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const presets = [
  { label: "3 ngày trước", days: 3 },
  { label: "7 ngày trước", days: 7 },
  { label: "30 ngày trước", days: 30 },
];

const POPUP_WIDTH = 360;
const GAP = 8;
const VIEWPORT_MARGIN = 12;

type Placement = { top: number; left: number; maxHeight: number };

export const DateRangeFilter = ({
  fromDate,
  toDate,
  onChange,
  placeholder = ["Từ ngày", "Đến ngày"],
  format = "DD/MM/YYYY",
}: DateRangeFilterProps) => {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Dayjs>(
    fromDate ? dayjs(fromDate) : dayjs()
  );
  const [start, setStart] = useState<Dayjs | null>(
    fromDate ? dayjs(fromDate) : null
  );
  const [end, setEnd] = useState<Dayjs | null>(toDate ? dayjs(toDate) : null);
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [ready, setReady] = useState(false); // đã đo xong chiều cao thật, cho phép hiển thị

  const anchorRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStart(fromDate ? dayjs(fromDate) : null);
  }, [fromDate]);

  useEffect(() => {
    setEnd(toDate ? dayjs(toDate) : null);
  }, [toDate]);

  const computePlacement = (): Placement | null => {
    const anchorRect = anchorRef.current?.getBoundingClientRect();
    if (!anchorRect) return null;

    // lần đầu (chưa đo được popup) dùng chiều cao ước lượng để không giật hình
    const popupHeight = popupRef.current?.offsetHeight ?? 460;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - anchorRect.bottom - GAP;
    const spaceAbove = anchorRect.top - GAP;

    let top: number;
    let maxHeight: number;

    if (spaceBelow >= popupHeight || spaceBelow >= spaceAbove) {
      // đủ chỗ bên dưới (hoặc dưới vẫn rộng hơn trên) -> mở xuống
      top = anchorRect.bottom + GAP;
      maxHeight = Math.max(
        200,
        Math.min(popupHeight, viewportHeight - top - VIEWPORT_MARGIN)
      );
    } else {
      // không đủ chỗ dưới -> lật lên trên
      const height = Math.min(popupHeight, spaceAbove);
      top = Math.max(VIEWPORT_MARGIN, anchorRect.top - GAP - height);
      maxHeight = Math.max(200, height);
    }

    const left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(anchorRect.left, viewportWidth - POPUP_WIDTH - VIEWPORT_MARGIN)
    );

    return { top, left, maxHeight };
  };

  // bước 1: khi vừa mở, đặt tạm vị trí (ước lượng) để popup có DOM và đo được
  useLayoutEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }
    setPlacement(computePlacement());
  }, [open]);

  // bước 2: sau khi popup đã render với vị trí tạm, đo chiều cao thật và định vị lại chính xác
  useLayoutEffect(() => {
    if (!open || !placement || ready) return;
    setPlacement(computePlacement());
    setReady(true);
  }, [open, placement, ready]);

  useEffect(() => {
    if (!open) return;

    const reposition = () => {
      setReady(false); // đo lại từ đầu khi cuộn/resize (nội dung modal có thể cuộn)
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        anchorRef.current?.contains(target) ||
        popupRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const emitChange = (nextStart: Dayjs | null, nextEnd: Dayjs | null) => {
    onChange?.({
      fromDate: nextStart ? nextStart.format("YYYY-MM-DD") : undefined,
      toDate: nextEnd ? nextEnd.format("YYYY-MM-DD") : undefined,
    });
  };

  const applyPreset = (days: number) => {
    const nextStart = dayjs().subtract(days, "day");
    const nextEnd = dayjs();
    setStart(nextStart);
    setEnd(nextEnd);
    setViewMonth(nextEnd);
    emitChange(nextStart, nextEnd);
  };

  const handleDayClick = (day: Dayjs) => {
    if (!start || (start && end)) {
      setStart(day);
      setEnd(null);
      emitChange(day, null);
      return;
    }
    if (day.isBefore(start, "day")) {
      setStart(day);
      setEnd(null);
      emitChange(day, null);
    } else {
      setEnd(day);
      emitChange(start, day);
      setOpen(false);
    }
  };

  const daysInGrid = useMemo(() => {
    const startOfMonth = viewMonth.startOf("month");
    const endOfMonth = viewMonth.endOf("month");
    const startOfGrid = startOfMonth.startOf("week");
    const endOfGrid = endOfMonth.endOf("week");

    const days: Dayjs[] = [];
    let cursor = startOfGrid;
    while (cursor.isBefore(endOfGrid) || cursor.isSame(endOfGrid, "day")) {
      days.push(cursor);
      cursor = cursor.add(1, "day");
    }
    return days;
  }, [viewMonth]);

  const rangeStart = start;
  const rangeEnd = end ?? (start && hoverDate ? hoverDate : null);

  const isInRange = (day: Dayjs) => {
    if (!rangeStart || !rangeEnd) return false;
    const lo = rangeStart.isBefore(rangeEnd) ? rangeStart : rangeEnd;
    const hi = rangeStart.isBefore(rangeEnd) ? rangeEnd : rangeStart;
    return day.isAfter(lo, "day") && day.isBefore(hi, "day");
  };

  const isRangeEdge = (day: Dayjs) => {
    if (start && day.isSame(start, "day")) return true;
    if (end && day.isSame(end, "day")) return true;
    return false;
  };

  const displayText = () => {
    if (!start && !end) return null;
    const startText = start ? start.format(format) : "";
    const endText = end ? end.format(format) : "";
    return `${startText}${startText || endText ? " → " : ""}${endText}`;
  };

  const popup =
    open && placement
      ? createPortal(
          <div
            ref={popupRef}
            style={{
              position: "fixed",
              top: placement.top,
              left: placement.left,
              zIndex: 1060,
              width: POPUP_WIDTH,
              maxWidth: `calc(100vw - ${VIEWPORT_MARGIN * 2}px)`,
              maxHeight: placement.maxHeight,
              overflowY: "auto",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
              // ẩn tạm khi chưa đo xong lần 2, tránh giật hình do đổi vị trí
              visibility: ready ? "visible" : "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                padding: "14px 14px 4px",
              }}
            >
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset.days)}
                  style={{
                    border: "none",
                    background: "#f1f4f8",
                    padding: "9px 14px",
                    borderRadius: 10,
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e0f2fe";
                    e.currentTarget.style.color = "#0588f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f1f4f8";
                    e.currentTarget.style.color = "#374151";
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 14px 10px",
              }}
            >
              <div style={{ display: "flex", gap: 4 }}>
                <HeaderButton
                  onClick={() => setViewMonth((m) => m.subtract(1, "year"))}
                >
                  «
                </HeaderButton>
                <HeaderButton
                  onClick={() => setViewMonth((m) => m.subtract(1, "month"))}
                >
                  ‹
                </HeaderButton>
              </div>

              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                }}
              >
                Tháng {viewMonth.format("M")} - {viewMonth.format("YYYY")}
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                <HeaderButton
                  onClick={() => setViewMonth((m) => m.add(1, "month"))}
                >
                  ›
                </HeaderButton>
                <HeaderButton
                  onClick={() => setViewMonth((m) => m.add(1, "year"))}
                >
                  »
                </HeaderButton>
              </div>
            </div>

            <div style={{ padding: "0 12px 16px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: 13,
                  fontWeight: 500,
                  paddingBottom: 6,
                }}
              >
                {WEEKDAYS.map((w) => (
                  <div key={w}>{w}</div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  rowGap: 6,
                }}
              >
                {daysInGrid.map((day) => {
                  const inCurrentMonth = day.isSame(viewMonth, "month");
                  const edge = isRangeEdge(day);
                  const inRange = isInRange(day);

                  return (
                    <div
                      key={day.format("YYYY-MM-DD")}
                      style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        background: inRange ? "#e6f2fe" : "transparent",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleDayClick(day)}
                        onMouseEnter={() => setHoverDate(day)}
                        style={{
                          width: 36,
                          height: 36,
                          lineHeight: "36px",
                          borderRadius: "50%",
                          border: "none",
                          fontSize: 17,
                          cursor: "pointer",
                          background: edge ? "#0f2b8f" : "transparent",
                          color: edge
                            ? "#fff"
                            : inRange
                            ? "#0f2b8f"
                            : inCurrentMonth
                            ? "#0f172a"
                            : "#d1d5db",
                        }}
                      >
                        {day.format("D")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={anchorRef} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          border: `1px solid ${open ? "#7cb342" : "#d9d9d9"}`,
          borderRadius: 10,
          padding: "10px 12px",
          cursor: "pointer",
          background: "#fff",
        }}
      >
        <span
          style={{
            color: displayText() ? "#0f172a" : "#9ca3af",
            fontSize: 15,
          }}
        >
          {displayText() ?? `${placeholder[0]} → ${placeholder[1]}`}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="#9ca3af"
            strokeWidth="1.6"
          />
          <path d="M3 9h18" stroke="#9ca3af" strokeWidth="1.6" />
          <path
            d="M8 3v4M16 3v4"
            stroke="#9ca3af"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {popup}
    </div>
  );
};

const HeaderButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      minWidth: 30,
      height: 30,
      lineHeight: "30px",
      padding: 0,
      borderRadius: 8,
      border: "none",
      background: "#f1f4f8",
      color: "#9ca3af",
      fontSize: 13,
      cursor: "pointer",
      flexShrink: 0,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#e0f2fe";
      e.currentTarget.style.color = "#0588f0";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#f1f4f8";
      e.currentTarget.style.color = "#9ca3af";
    }}
  >
    {children}
  </button>
);