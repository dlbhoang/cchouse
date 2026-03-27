import { Col, ConfigProvider, Pagination, Row, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { baseFilter } from "@/lib/core/configs/appConst";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import { IBaseOpts } from "@/lib/types/filter";
import { useAdminContext } from "../../../stored/context/index";

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
  ...props
}: IListData<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const { smallScreen } = useAdminContext();
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
      <Table
        {...props}
        rowKey="Id"
        size="small"
        rowSelection={rowSelection}
        columns={cols}
        dataSource={data}
        pagination={false}
        bordered={bordered}
        loading={waitingData === 20 ? false : loading}
        scroll={{ x: smallScreen ? "max-content" : 1200 }}
        expandable={
          expandedRowRender && {
            expandedRowRender: (record: any, index: number) =>
              expandedRowRender && expandedRowRender(index),
            defaultExpandedRowKeys: ["0"],
          }
        }
        onRow={(record: T) => handleRow(record)}
        // eslint-disable-next-line react/no-unstable-nested-components
        footer={() => (
          <Row gutter={[0, 16]}>
            {/* <Col span={12} style={{ margin: 'auto' }}>
            <span>
              Hiển thị từ{' '}
              {total === 0
                ? 0
                : (searchOptions.pageIndex - 1) * searchOptions.pageSize +
                  1}{' '}
              đến{' '}
              {searchOptions.pageIndex * searchOptions.pageSize > total
                ? total
                : searchOptions.pageIndex * searchOptions.pageSize}{' '}
              trong {total} kết quả
            </span>
          </Col> */}
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {/* <span>
              Tìm được <Typography.Text strong> {total}</Typography.Text> kết
              quả
            </span> */}
              <Pagination
                defaultCurrent={1}
                total={total}
                defaultPageSize={baseFilter.pageSize}
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
              <span />
            </Col>
          </Row>
        )}
      />
    </ConfigProvider>
  );
}

export default TableBase;
