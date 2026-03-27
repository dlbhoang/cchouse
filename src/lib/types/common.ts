import { SelectProps } from 'antd';

export type Direction = 'vertical' | 'horizontal';

export type OptionType = {
  value: number | string;
  label: string;
  slug?: string;
  disabled?: boolean | undefined;
};

export type CheckboxType = {
  value?: (string | number)[];
  onChange?: (val: (string | number)[]) => void;
};

export type SelectType = {
  parentVal?: number | string | string[] | null;
  value?: number | number[] | string | string[] | null;
  mode?: 'multiple' | 'tags';
  allowClear?: boolean;
  disabled?: boolean;
  onChange?: (
    val: number | number[] | string | string[],
    opts?: OptionType | OptionType[]
  ) => void;
} & SelectProps;

export interface IFormFieldProps {
  name: string;
  hiddenLabel?: boolean;
  isRequired?: boolean;

  placeholder?: string;

  className?: string;
}
