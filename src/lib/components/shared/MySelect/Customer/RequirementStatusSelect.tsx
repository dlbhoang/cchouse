import SelectBase from "../base/SelectBase";
import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";

type Props = {
  isRent?: boolean;
};

export const RequirementStatusSelect = ({
  isRent,
  mode,
  value,
  onChange,
}: Props & SelectType) => {
  const { enumList } = useAdminContext();
  const data = enumList?.RequimentStatus.map((e) => ({
    label: e.Name,
    value: e.Value,
  }));
  return (
    <SelectBase
      mode={mode}
      placeholder="Trạng thái"
      allowClear
      options={isRent ? data?.filter((x) => x.value !== 0) : data}
      onChange={onChange}
      value={value}
    />
  );
};
