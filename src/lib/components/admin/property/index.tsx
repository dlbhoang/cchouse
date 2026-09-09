import { Flex } from "antd";
import { useState } from "react";
import { baseFilter } from "@/lib/core/configs/appConst";
import { ETransType } from "@/lib/core/enum";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import PropertyFilter from "./filter";
import PropertyPageHeader from "./pageHeader";
import { PropertyTable } from "./table";

type Props = {
  onOpenDetail?: (id: number) => void;
  onOpenAdd?: (opts?: {
    transType?: number;
    query?: {
      AddressNumber?: string;
      ProvinceId?: string;
      DistrictId?: string;
      WardId?: string;
      StreetId?: string;
    };
  }) => void;
};

/**
 * Assembles the property list screen: title/summary header (Tab_bar.png),
 * search + advanced filters (Search_bar.png) and the results table
 * (table_mua_ban.png). Row-level pagination (Panigation.png) is rendered
 * inside the shared TableBase component used by PropertyTable.
 */
const PropertyListPage = ({ onOpenDetail, onOpenAdd }: Props) => {
  const [searchOptions, setSearchOptions] = useState<IPropAdminOpts>({
    ...baseFilter,
    Status: [1],
    TransType: ETransType.sell,
  });
  const [total, setTotal] = useState(0);

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    setSearchOptions((prev) => ({ ...prev, pageIndex, pageSize }));
  };

  return (
    <Flex vertical gap={16}>
      <PropertyPageHeader
        total={total}
        searchOptions={searchOptions}
        onAdd={() => onOpenAdd?.({ transType: searchOptions.TransType })}
      />

      <PropertyFilter model={searchOptions} onSubmit={setSearchOptions} />

      <PropertyTable
        searchOptions={searchOptions}
        onPageIndexChange={handlePageIndexChange}
        onOpenDetail={onOpenDetail}
        onOpenAdd={onOpenAdd}
        onTotalChange={setTotal}
      />
    </Flex>
  );
};

export default PropertyListPage;