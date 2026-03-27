import { useAdminContext } from "@/lib/stored";
import { SelectType } from "@/lib/types/common";
import SelectBase from "../base/SelectBase";

type Props = {
  onlyMain?: boolean;
};

export const LawSelect = ({
  onlyMain,
  mode,
  value,
  onChange,
  ...props
}: SelectType & Props) => {
  const { enumList } = useAdminContext();
  const options = onlyMain
    ? enumList.Law.filter((x) => [1, 2, 17, 21, 22, 23].includes(x.Value))
    : enumList.Law;
  return (
    <SelectBase
      mode={mode}
      placeholder="Pháp lý"
      allowClear
      options={options.map((e) => ({
        label: e.Name,
        value: e.Value,
      }))}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};
