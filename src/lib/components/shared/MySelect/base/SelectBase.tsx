import { Select, SelectProps, Spin } from "antd";
import { JSXElementConstructor, ReactElement } from "react";

import { OptionType } from "@/lib/types/common";

const onSearch = (value: string) => {
  console.log("search:", value);
};

type Props = {
  value?: any; // number | number[] | string | string[] | null;
  loading?: boolean;
  labelInValue?: boolean;
  mode?: "multiple" | "tags";
  allowClear?: boolean;
  placeholder: string;
  options: OptionType[] | undefined;
  onChange?: (val: any, opts: OptionType | OptionType[]) => void;
  dropdownRender?: (
    menu: ReactElement<any, string | JSXElementConstructor<any>>
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
};

const SelectBase = ({
  value,
  loading,
  mode,
  placeholder,
  allowClear = true,
  options,
  labelInValue,
  showSearch = true,
  onChange,

  ...props
}: SelectProps) => {
  return (
    <Select
      {...props}
      showSearch={showSearch}
      allowClear={allowClear}
      // style={{ width: '100%' }}
      mode={mode}
      value={value}
      placeholder={placeholder}
      optionFilterProp="children"
      // onChange={onChange}
      onChange={(val, opts) => {
        if (onChange) {
          if (Array.isArray(val) && val?.includes("all")) {
            onChange(
              (options ?? []).filter((x) => !x.disabled).map((e) => e.value),
              options ?? []
            );
          } else {
            onChange(val, opts);
          }
        }
      }}
      onSearch={onSearch}
      filterOption={(input, option) =>
        (option?.label ?? "")
          .toString()
          .toLowerCase()
          .includes(input.toLowerCase()) ||
        (option?.slug ?? "").toLowerCase().includes(input.toLowerCase())
      }
      maxTagCount="responsive"
      options={
        mode === "multiple"
          ? [
              {
                label: "Tất cả",
                value: "all",
              },
              ...(options ?? []),
            ]
          : options
      }
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : "Không có dữ liệu"}
    />
  );
};

export default SelectBase;
