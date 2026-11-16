import { Select } from "@/lib/components/antd-lucide";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export type PaginationLabels = {
  selectedCount?: (selectedCount: number, total: number) => string;
  pageSize?: string;
  pageCount?: (currentPage: number, totalPages: number) => string;
};

type Props = {
  selectedCount?: number;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (pageIndex: number, pageSize: number) => void;
  labels?: PaginationLabels;
};

/** The same pagination controls can sit inside a table or in a separate toolbar. */
export default function CustomPagination({ selectedCount = 0, total, currentPage, pageSize, onPageChange, labels }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const changePage = (page: number) => onPageChange(page, pageSize);
  return (
    <div className="table-custom-footer">
      <span className="table-selected-count">
        {labels?.selectedCount?.(selectedCount, total) ?? `${selectedCount} trên ${total} hàng được chọn.`}
      </span>
      <div className="table-custom-pagination">
        <span>{labels?.pageSize ?? "Hàng trên trang"}</span>
        <Select
          size="small"
          value={pageSize}
          options={[10, 20, 30, 40, 50].map((value) => ({ label: value, value }))}
          onChange={(value) => onPageChange(1, value)}
        />
        <span>{labels?.pageCount?.(currentPage, totalPages) ?? `Trang ${currentPage} trong ${totalPages}`}</span>
        <button type="button" aria-label="Trang đầu" disabled={currentPage <= 1} onClick={() => changePage(1)}><ChevronsLeft size={16} strokeWidth={1.8} /></button>
        <button type="button" aria-label="Trang trước" disabled={currentPage <= 1} onClick={() => changePage(currentPage - 1)}><ChevronLeft size={16} strokeWidth={1.8} /></button>
        <button type="button" aria-label="Trang sau" disabled={currentPage >= totalPages} onClick={() => changePage(currentPage + 1)}><ChevronRight size={16} strokeWidth={1.8} /></button>
        <button type="button" aria-label="Trang cuối" disabled={currentPage >= totalPages} onClick={() => changePage(totalPages)}><ChevronsRight size={16} strokeWidth={1.8} /></button>
      </div>
    </div>
  );
}
