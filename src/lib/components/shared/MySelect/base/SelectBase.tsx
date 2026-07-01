import { Select, type SelectProps, Spin } from "antd";
import type { JSXElementConstructor, ReactElement } from "react";

const onSearch = (value: string) => {
  console.log("search:", value);
};

type SelectBaseProps = Omit<SelectProps, "options" | "onChange" | "mode"> & {
  value?: number | number[] | string | string[] | null;
  loading?: boolean;
  mode?: "multiple" | "tags";
  allowClear?: SelectProps["allowClear"];
  placeholder?: string;
  options?: SelectProps["options"];
  onChange?: (val: any, opts: any) => void;
  dropdownRender?: (
    menu: ReactElement<any, string | JSXElementConstructor<any>>
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
};

const normalizeValue = (
  value: any,
  options?: SelectProps["options"]
): number | number[] | string | string[] | null | undefined => {
  if (value === undefined || value === null || value === "") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item, options)) as Array<string | number>;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return value;
    }

    const matchedOption = options?.find(
      (option) => String(option?.value) === trimmedValue
    );

    if (matchedOption) {
      return matchedOption.value as number | string;
    }

    const numericValue = Number(trimmedValue);
    if (!Number.isNaN(numericValue) && String(numericValue) === trimmedValue) {
      return numericValue;
    }
  }

  return value;
};

const SelectBase = ({
  value,
  loading,
  mode,
  placeholder,
  allowClear = true,
  options,
  showSearch = true,
  onChange,
  ...props
}: SelectBaseProps) => {
  const normalizedValue = normalizeValue(value, options);

  return (
    <Select
      {...props}
      showSearch={showSearch}
      allowClear={allowClear}
      mode={mode}
      value={normalizedValue}
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={(val, opts) => {
        if (onChange) {
          if (Array.isArray(val) && val?.includes("all")) {
            const optionList = (options ?? []).filter((item: any) => !item.disabled);
            onChange(optionList.map((item: any) => item.value), optionList);
          } else {
            onChange(normalizeValue(val, options), opts);
          }
        }
      }}
      onSearch={onSearch}
      filterOption={(input, option) => {
        const label = (option?.label ?? "").toString().toLowerCase();
        const slug = ((option as any)?.slug ?? "").toLowerCase();
        return label.includes(input.toLowerCase()) || slug.includes(input.toLowerCase());
      }}
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
          : (options ?? [])
      }
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : "Không có dữ liệu"}
    />
  );
};

export default SelectBase;
