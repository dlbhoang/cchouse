"use client";
import { Collapse as LucideCollapse } from "@/lib/components/antd-lucide";
import { Table } from "antd";

import Link from "next/link";
import { useEffect, useState } from "react";
import PropertySubTable from "@/lib/components/admin/property/table/subTable";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";

type Props = {
  data: IPropResponse;
  defaultExpanded?: boolean;
  compact?: boolean;
};

const WarehouseSection = ({ data, defaultExpanded = false, compact = false }: Props) => {
  const [propOfCustomer, setPropOfCustomer] = useState<IPropResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRow, setTotalRow] = useState(0);

  useEffect(() => {
    if (!data.CustomerPhone) {
      setPropOfCustomer([]);
      setTotalRow(0);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await propertyApi.get({
          pageIndex: 1,
          pageSize: 100,
          search: data.CustomerPhone.toString(),
          TransType: data.TransType,
        } as IPropAdminOpts);

        setPropOfCustomer(result.data);
        setTotalRow(result.totalRow ?? 0);
      } catch {
        setPropOfCustomer([]);
        setTotalRow(0);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [data.CustomerPhone, data.TransType]);

  return (
    <LucideCollapse
      ghost
      size="small"
      className="pd-warehouse"
      defaultActiveKey={defaultExpanded ? ["warehouse"] : []}
      items={[
        {
          key: "warehouse",
          label: `Tìm được ${totalRow} BĐS trong kho dữ liệu`,
          extra: (
            <Link
              href={`${AppRoutes.property.url}?Search=${data.CustomerPhone}`}
              className="pd-warehouse-link"
              onClick={(e) => e.stopPropagation()}
            >
              Xem tất cả
            </Link>
          ),
          children: (
            compact ? <Table
              rowKey="Id"
              dataSource={propOfCustomer}
              loading={loading}
              pagination={false}
              scroll={{ x: 900 }}
              columns={[
                { title: "Mã", dataIndex: "Id", render: (id: number, record: IPropResponse) => <Link href={`${AppRoutes.property.url}/${id}?TransType=${record.TransType}`}>{id}</Link> },
                { title: "Giá", dataIndex: "DisplayPrice" },
                { title: "Địa chỉ", dataIndex: ["PropAddress", "DisplayAddress"] },
                { title: "Loại BĐS", dataIndex: ["PropAddress", "PropTypeName"] },
                { title: "Kết cấu", dataIndex: "CustomDisplayStructures" },
                { title: "Diện tích", dataIndex: "Area", render: (area: number) => area ? `${area}m²` : "—" },
                { title: "Vị trí", dataIndex: ["PropAddress", "LocationName"] },
                { title: "Trạng thái", dataIndex: "StatusName" },
              ]}
            /> : <PropertySubTable data={propOfCustomer} loading={loading} />
          ),
        },
      ]}
    />
  );
};

export default WarehouseSection;
