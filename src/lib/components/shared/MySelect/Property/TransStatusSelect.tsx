import { ETransType } from "@/lib/core/enum";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";
import SelectBase from "../base/SelectBase";

type Props = {
  transType: ETransType;
};
export const TransStatusSelect = ({
  transType,
  mode,
  value,
  onChange,
  allowClear,
  ...props
}: SelectType & Props) => {
  const { enumList } = useAdminContext();
  return (
    <SelectBase
      mode={mode}
      placeholder="Trạng thái giao dịch"
      allowClear={allowClear}
      options={enumList.TransStatus.map((e, idx) =>
        idx > 0
          ? {
              label: e.Name,
              value: e.Value,
            }
          : {
              label:
                Number(transType) === ETransType.sell ? e.Name : "Cho thuê",
              value: e.Value,
            }
      )}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};
