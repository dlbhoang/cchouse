import { Pagination as LucidePagination } from "@/lib/components/antd-lucide";
import {ConfigProvider, Table} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { baseFilter } from "@/lib/core/configs/appConst";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { IBaseOpts } from "@/lib/types/filter";
import { SkeletonTable } from "./TableSkeleton";
import CustomPagination, { type PaginationLabels } from "./CustomPagination";

interface IListData<T> {
  data: T[];
  cols: ColumnsType<T>;
  rowSelection?: TableRowSelection<T> | undefined;
  total?: number;
  loading: boolean;
  searchOptions: ISearchOptions | IBaseOpts;
  bordered?: boolean;
  tableLayout?: "auto" | "fixed";
  onPageIndexChange?: (pageIndex: number, pageSize: number) => void;
  expandedRowRender?: (index: number) => JSX.Element;
  onRowClick?: (record: T) => void;
  useCustomPagination?: boolean;
  customPaginationLabels?: PaginationLabels;
  showPagination?: boolean;
  scrollY?: number | string;
}

function TableBase<T>({
  data,
  cols,
  total,
  loading,
  searchOptions,
  rowSelection,
  bordered,
  onPageIndexChange,
  expandedRowRender,
  onRowClick,
  useCustomPagination = false,
  customPaginationLabels,
  scrollY,
  showPagination = true,
  ...props
}: IListData<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const [waitingData, setWaitingData] = useState(0);

  const timeout = setTimeout(() => {
    if (loading && waitingData < 20) {
      setWaitingData(waitingData + 1);
    }
  }, 1000);

  if (waitingData === 20) clearTimeout(timeout);

  const handleRow = (record: T) => {
    if (onRowClick) {
      return {
        onClick: () => onRowClick(record),
      };
    }
    return {};
  };

  const onDefPageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({
        ...searchOptions,
        pageIndex,
        pageSize,
      })}`
    );
  };
  return (
    <ConfigProvider
      renderEmpty={() => (
        <div style={{ textAlign: "center" }}>
          <p>Không tìm thấy dữ liệu</p>
        </div>
      )}
    >
      {loading && waitingData < 20 ? (
        <SkeletonTable columns={cols} rowCount={5} />
      ) : (
        <Table
          {...props}
          rowKey="Id"
          size="small"
          rowSelection={rowSelection}
          columns={cols}
          dataSource={data}
          pagination={false}
          bordered={bordered}
          loading={false}
          scroll={{ x: "max-content", ...(scrollY ? { y: scrollY } : {}) }}
          expandable={
            expandedRowRender && {
              expandedRowRender: (record: any, index: number) =>
                expandedRowRender && expandedRowRender(index),
              defaultExpandedRowKeys: ["0"],
              expandIcon: ({ expanded, onExpand, record }) => (
                <button
                  type="button"
                  aria-label={expanded ? "Thu gọn dòng" : "Mở rộng dòng"}
                  className="inline-flex size-6 items-center justify-center text-[#737373] transition-colors hover:text-[#0788f5]"
                  onClick={(event) => onExpand(record, event)}
                >
                  <ChevronRight
                    size={16}
                    strokeWidth={1.8}
                    className={expanded ? "rotate-90 transition-transform" : "transition-transform"}
                  />
                </button>
              ),
            }
          }
          onRow={(record: T) => handleRow(record)}
          // eslint-disable-next-line react/no-unstable-nested-components
          footer={showPagination ? () => {
            const selectedCount = rowSelection?.selectedRowKeys?.length ?? 0;
            const currentPage = Number(searchOptions.pageIndex ?? 1);
            const currentPageSize = Number(
              searchOptions.pageSize ?? baseFilter.pageSize
            );
            if (useCustomPagination) {
              return <CustomPagination
                selectedCount={selectedCount}
                total={total ?? 0}
                currentPage={currentPage}
                pageSize={currentPageSize}
                labels={customPaginationLabels}
                onPageChange={onPageIndexChange ?? onDefPageIndexChange}
              />;
            }

            return (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", padding: "12px 0" }}>
                <div style={{ flex: "1 1 auto" }}>
                  {rowSelection && (
                    <span style={{ fontSize: "14px", color: "#737373" }}>
                      {selectedCount} of {total} dòng đã chọn.
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "32px", flex: "0 1 auto" }}>
                  <LucidePagination
                    defaultCurrent={1}
                    total={total}
                    defaultPageSize={baseFilter.pageSize}
                    pageSize={Number(searchOptions.pageSize ?? baseFilter.pageSize)}
                    pageSizeOptions={["10", "20", "30", "40", "50"]}
                    current={Number(searchOptions.pageIndex ?? 1)}
                    showSizeChanger
                    onChange={(pageIndex: number, pageSize: number) =>
                      onPageIndexChange
                        ? onPageIndexChange(pageIndex, pageSize)
                        : onDefPageIndexChange(pageIndex, pageSize)
                    }
                    showTitle
                  />
                </div>
              </div>
            );
          } : undefined}
        />
      )}
    </ConfigProvider>
  );
}

export default TableBase;
