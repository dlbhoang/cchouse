import TableNoPaging from "@/lib/components/shared/TableNoPaging";

import type { IApartmentUnitResponse } from "@/services/api/apartment/unit/IApartmentUnit";
import { subCols } from "./subCols";

type Props = {
  data: IApartmentUnitResponse[];
  loading: boolean;
};
const ApartmentUnitSubTable = ({ data, loading }: Props) => {
  return <TableNoPaging data={data} cols={subCols} loading={loading} />;
};

export default ApartmentUnitSubTable;
