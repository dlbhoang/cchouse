import type { ReactNode } from "react";
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
  className?: string;
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