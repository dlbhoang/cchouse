"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Panigation — Figma node I214:52440;640:55376.
 * Nút 32px radius 8, border #e5e5e5, disabled = opacity 50%.
 */

const PAGE_SIZES = [10, 20, 50, 100];

type Props = {
  total: number;
  pageIndex: number;
  pageSize: number;
  selectedCount?: number;
  onChange: (pageIndex: number, pageSize: number) => void;
};

function NavButton({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-[32px] shrink-0 flex-col items-center justify-center rounded-[8px] px-[12px]",
        "border border-[var(--fig-border-default)] bg-white text-[var(--fig-text-main)]",
        disabled ? "opacity-50" : "hover:bg-[var(--fig-text-bg)]"
      )}
    >
      <Icon className="size-[16px] shrink-0" />
    </button>
  );
}

export function PropertyPagination({
  total,
  pageIndex,
  pageSize,
  selectedCount = 0,
  onChange,
}: Props) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, pageIndex), pageCount);
  const isFirst = current <= 1;
  const isLast = current >= pageCount;

  return (
    <div
      className="flex w-full max-w-[1300px] items-center gap-[8px] bg-white py-[12px]"
      data-node-id="I214:52440;640:55376"
    >
      <p className="min-w-px flex-1 truncate text-[14px] font-normal leading-[20px] text-[var(--fig-text-muted)]">
        {selectedCount} trên {total} hàng được chọn.
      </p>

      <div className="flex shrink-0 items-center gap-[32px]">
        <div className="flex shrink-0 items-center gap-[8px]">
          <span className="pr-[8px] text-[14px] font-medium leading-[20px] text-[var(--fig-text-main)]">
            Hàng trên trang
          </span>
          <div
            className={cn(
              "relative flex h-[36px] w-[80px] shrink-0 items-center justify-between rounded-[8px]",
              "border border-[var(--fig-border-default)] bg-white px-[12px] py-[8px]",
              "shadow-[var(--fig-shadow-xs)]"
            )}
          >
            <select
              value={pageSize}
              onChange={(e) => onChange(1, Number(e.target.value))}
              aria-label="Số hàng trên trang"
              className="fig-native-select w-full text-[14px] font-normal leading-[20px] text-[var(--fig-text-main)]"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none size-[16px] shrink-0 text-[var(--fig-text-main)]" />
          </div>
        </div>

        <span className="shrink-0 pr-[8px] text-[14px] font-medium leading-[20px] text-[var(--fig-text-main)]">
          Trang {current} trong {pageCount}
        </span>

        <div className="flex shrink-0 items-center gap-[8px]">
          <NavButton
            icon={ChevronLeft}
            label="Trang trước"
            disabled={isFirst}
            onClick={() => onChange(current - 1, pageSize)}
          />
          <NavButton
            icon={ChevronsLeft}
            label="Trang đầu"
            disabled={isFirst}
            onClick={() => onChange(1, pageSize)}
          />
          <NavButton
            icon={ChevronRight}
            label="Trang sau"
            disabled={isLast}
            onClick={() => onChange(current + 1, pageSize)}
          />
          <NavButton
            icon={ChevronsRight}
            label="Trang cuối"
            disabled={isLast}
            onClick={() => onChange(pageCount, pageSize)}
          />
        </div>
      </div>
    </div>
  );
}

export default PropertyPagination;