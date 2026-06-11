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

export function DateRangeFilter({
  name,
  isRequired = false,
  label = "Khoảng thời gian",
  fromDateName = "fromDate",
  toDateName = "toDate",
  placeholder = ["Từ ngày", "Đến hết ngày"],
  className,
  showLabel = false,
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
                className="date-range-booking"
              >
                {/* Ngày bắt đầu */}
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: "#fff",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>
                    Ngày bắt đầu
                  </div>
                  <DatePicker
                    value={fromDate ? dayjs(fromDate) : null}
                    onChange={(val) => {
                      form.setValue(fromDateName, val?.format("YYYY-MM-DD") || null);
                      field.onChange([val, toDate ? dayjs(toDate) : null]);
                    }}
                    format={appConst.DATE_FORMAT}
                    placeholder={placeholder[0]}
                    disabledDate={(d) => toDate ? d.isAfter(dayjs(toDate)) : false}
                    style={{ width: "100%", border: "none", boxShadow: "none", padding: 0 }}
                    variant="borderless"
                    inputReadOnly
                  />
                </div>

                {/* Ngày kết thúc */}
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: "#fff",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>
                    Ngày kết thúc
                  </div>
                  <DatePicker
                    value={toDate ? dayjs(toDate) : null}
                    onChange={(val) => {
                      form.setValue(toDateName, val?.format("YYYY-MM-DD") || null);
                      field.onChange([fromDate ? dayjs(fromDate) : null, val]);
                    }}
                    format={appConst.DATE_FORMAT}
                    placeholder={placeholder[1]}
                    disabledDate={(d) => fromDate ? d.isBefore(dayjs(fromDate)) : false}
                    style={{ width: "100%", border: "none", boxShadow: "none", padding: 0 }}
                    variant="borderless"
                    inputReadOnly
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
