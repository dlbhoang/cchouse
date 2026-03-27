"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminContext } from "@/lib/stored";
import type { IFormFieldProps } from "@/lib/types/common";

const PriceUnitField = ({
  name,
  className,
  hiddenLabel = false,
  isRequired = false,
  placeholder = "Chọn đơn vị",
}: IFormFieldProps) => {
  const { enumList } = useAdminContext();
  const form = useFormContext();

  const options = enumList.PaymentMethod.map((e) => ({
    label: e.Name,
    value: e.Value,
  }));

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {!hiddenLabel && (
            <FormLabel isRequired={isRequired}>Đơn vị</FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value?.toString() || ""}
            value={field.value?.toString() || ""}
          >
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PriceUnitField;
