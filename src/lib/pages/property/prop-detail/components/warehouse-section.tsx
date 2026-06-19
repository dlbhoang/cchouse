"use client";

import { Collapse } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import PropertySubTable from "@/lib/components/admin/property/table/subTable";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";
import propertyApi from "@/services/api/property/propertyApi";

type Props = {
  data: IPropResponse;
};

const WarehouseSection = ({ data }: Props) => {
  const [propOfCustomer, setPropOfCustomer] = useState<IPropResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRow, setTotalRow] = useState(0);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [data.CustomerPhone, data.TransType]);

  return (
    <Collapse
      ghost
      size="small"
      className="pd-warehouse"
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
            <PropertySubTable data={propOfCustomer} loading={loading} />
          ),
        },
      ]}
    />
  );
};

export default WarehouseSection;
