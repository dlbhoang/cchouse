"use client";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { appConst } from "@/lib/core/configs/appConst";

interface DatePickerFieldProps {
  name: string;
  isRequired?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  showLabel?: boolean;
}

export function DatePickerField({
  name,
  isRequired = false,
  label = "Từ ngày",
  placeholder = "Chọn ngày",
  className,
  showLabel = false,
}: DatePickerFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const date = form.watch(name);

        return (
          <FormItem className={className}>
            {showLabel && (
              <FormLabel isRequired={isRequired}>{label}</FormLabel>
            )}
            <FormControl>
              <DatePicker
                value={date ? dayjs(date) : null}
                onChange={(values) => {
                  form.setValue(name, values?.format("YYYY-MM-DD") || null);
                  field.onChange(values);
                }}
                allowClear
                placeholder={placeholder}
                format={appConst.DATE_FORMAT}
                style={{ width: "100%" }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
