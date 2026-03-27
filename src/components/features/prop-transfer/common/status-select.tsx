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
import type { IFormFieldProps } from "@/lib/types/common";
import { PropTransferStatusOptions } from "@/services/property/models/prop-transfer";

const StatusSelectField = ({
  name,
  className,
  hiddenLabel = false,
  isRequired = false,
  placeholder = "Trạng thái",
}: IFormFieldProps) => {
  const options = PropTransferStatusOptions;
  const formTest = useFormContext();

  return (
    <FormField
      control={formTest.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {!hiddenLabel && (
            <FormLabel isRequired={isRequired}>Trạng thái</FormLabel>
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

export default StatusSelectField;
