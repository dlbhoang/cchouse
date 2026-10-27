import type { ReactNode } from "react";
import type { SelectProps } from "antd";
export type Direction = 'vertical' | 'horizontal';

export type OptionType = {
  value: number | string;
  label: string;
  slug?: string;
  disabled?: boolean;
};

export type CheckboxType = {
  value?: (string | number)[];
  onChange?: (val: (string | number)[]) => void;
};

export type SelectType = {
  parentVal?: number | string | null;
  value?: number | string | (number | string)[] | null;
  mode?: 'multiple' | 'single' | 'tags';
  allowClear?: boolean;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  showAllOption?: boolean;
  className?: string;
  popupClassName?: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  builtinPlacements?: SelectProps["builtinPlacements"];
  listHeight?: number;
  suffixIcon?: ReactNode;
  options?: OptionType[];
  onChange?: (
    val: number | number[] | string | string[],
    opts?: OptionType | OptionType[]
  ) => void;
};

export interface IFormFieldProps {
  name: string;
  hiddenLabel?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  className?: string;
}
