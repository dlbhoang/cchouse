"use client";

import { Alert, Input } from "antd";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateRangeFilter } from "@/components/ui/form-field/date-range-filter";
import { calculateDuration } from "@/lib/utils";
import type { ILeaveRequest } from "../types/leave-request";

const MainForm = ({ form }: { form: UseFormReturn<ILeaveRequest> }) => {
  const startDate = form.watch("StartDate");
  const endDate = form.watch("EndDate");

  const duration =
    startDate && endDate ? calculateDuration(startDate, endDate) : 0;

  return (
    <>
      <DateRangeFilter
        label="Thời gian xin nghỉ"
        name="dateRange"
        fromDateName="StartDate"
        toDateName="EndDate"
        showLabel
        isRequired
        hidePresets
      />

      <div className="flex justify-between">
        <span className="text-sm font-medium">Số ngày nghỉ:</span>
        <span className="font-medium text-blue-600">
          {duration > 0 ? duration : "--"} ngày
        </span>
      </div>

      <FormField
        control={form.control}
        name="RequestNotes"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel isRequired>Lý do</FormLabel>
            <FormControl>
              <Input.TextArea
                showCount
                maxLength={300}
                placeholder="Mô tả rõ lý do xin nghỉ phép, tối thiểu 100 kí tự"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Alert
        message={
          <ul className="list-disc list-inside text-sm">
            <li>
              Cam kết bàn giao lại công việc cho phòng Kinh doanh, không gây
              chậm trễ tiến độ công việc.
            </li>
            <li>Cam kết thực hiện đúng quy định công ty.</li>
          </ul>
        }
        type="info"
        // showIcon
      />
    </>
  );
};

export default MainForm;
