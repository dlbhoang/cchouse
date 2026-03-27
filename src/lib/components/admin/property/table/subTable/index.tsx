import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";

import { CopyOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import { subCols } from "./subCols";

type Props = {
  data: IPropResponse[];
  loading: boolean;
  onCopy?: (id: number) => void;
};
const PropertySubTable = ({ data, loading, onCopy }: Props) => {
  const cols = useMemo(() => {
    if (!onCopy) {
      return subCols.filter((col) => col.key !== "action");
    }

    return subCols.map((col) => {
      if (col.key === "action") {
        return {
          ...col,
          render: (value: number) => {
            return (
              <BtnConfirm
                icon={<CopyOutlined />}
                title="Sao chép nhanh thông tin bất động sản"
                type="icon"
                description="Thông tin sẽ được điền nhanh vào mẫu"
                onOkClick={() => {
                  onCopy?.(value);
                }}
              />
            );
          },
        };
      }
      return col;
    });
  }, [onCopy]);

  return <TableNoPaging data={data} cols={cols} loading={loading} />;
};

export default PropertySubTable;
