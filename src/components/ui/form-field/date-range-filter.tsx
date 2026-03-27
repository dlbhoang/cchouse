"use client";

import type { TimeRangePickerProps } from "antd";
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

const { RangePicker } = DatePicker;

interface DateRangeFilterProps {
  name: string;
  isRequired?: boolean;
  label?: string;
  fromDateName?: string;
  toDateName?: string;
  placeholder?: [string, string];
  className?: string;
  showLabel?: boolean;
  hidePresets?: boolean;
}

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Hôm nay", value: [dayjs(), dayjs()] },
  { label: "3 ngày trước", value: [dayjs().add(-3, "d"), dayjs()] },
  { label: "7 ngày trước", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "30 ngày trước", value: [dayjs().add(-30, "d"), dayjs()] },
];

export function DateRangeFilter({
  name,
  isRequired = false,
  label = "Khoảng thời gian",
  fromDateName = "fromDate",
  toDateName = "toDate",
  placeholder = ["Từ ngày", "Đến hết ngày"],
  className,
  showLabel = false,
  hidePresets = false,
}: DateRangeFilterProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const fromDate = form.watch(fromDateName);
        const toDate = form.watch(toDateName);

        return (
          <FormItem className={className}>
            {showLabel && (
              <FormLabel isRequired={isRequired}>{label}</FormLabel>
            )}
            <FormControl>
              <RangePicker
                value={[
                  fromDate ? dayjs(fromDate) : null,
                  toDate ? dayjs(toDate) : null,
                ]}
                onChange={(values) => {
                  form.setValue(
                    fromDateName,
                    values?.[0]?.format("YYYY-MM-DD") || null
                  );
                  form.setValue(
                    toDateName,
                    values?.[1]?.format("YYYY-MM-DD") || null
                  );
                  field.onChange(values);
                }}
                presets={hidePresets ? undefined : rangePresets}
                allowEmpty={[true, true]}
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
