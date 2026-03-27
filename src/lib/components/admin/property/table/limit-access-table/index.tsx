import { CopyOutlined } from "@ant-design/icons";
import { Home, Plus } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import TableNoPaging from "@/lib/components/shared/TableNoPaging";
import { IPropCheckAddress } from "@/lib/interfaces/Property/IProp";
import { subCols } from "./subCols";

type Props = {
  data: IPropCheckAddress[];
  loading: boolean;
  onCopy?: (id: number) => void;
  onAdd?: () => void;
};
const LimitAccessPropTable = ({ data, loading, onCopy, onAdd }: Props) => {
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

  return (
    <TableNoPaging
      data={data}
      cols={cols}
      loading={loading}
      emptyContent={
        <div className="text-center py-8 text-gray-500">
          <div className="mb-2">
            <Home className="h-8 w-8 mx-auto" />
          </div>
          <p>Không tìm thấy dữ liệu phù hợp</p>
          {onAdd && (
            <Button variant="link" onClick={onAdd}>
              <Plus />
              Thêm mới
            </Button>
          )}
        </div>
      }
    />
  );
};

export default LimitAccessPropTable;
