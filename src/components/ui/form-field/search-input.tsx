"use client";

import { RefreshCcw, Search } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { IFormFieldProps } from "@/lib/types/common";
import { cn } from "@/lib/utils";
import { Button } from "../button";
import { Input } from "../input";

type Props = {
  onReset: () => void;
  inputOnly?: boolean;
} & IFormFieldProps;

const SearchInputField = ({
  name,
  className,
  onReset,
  placeholder = "Tìm mã bất động sản",
  inputOnly = false,
}: Props) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex w-full">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <FormControl>
                <Input
                  type="text"
                  placeholder={placeholder}
                  className={cn(
                    "pl-10 ",
                    !inputOnly && "rounded-r-none",
                    className
                  )}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
            </div>

            {!inputOnly && (
              <div className="flex">
                <Button type="submit" className="rounded-none" size="icon">
                  <Search className="h-4 w-4" />
                </Button>

                <Button
                  onClick={onReset}
                  variant="outline"
                  className=" rounded-l-none"
                  size="icon"
                  type="button"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SearchInputField;
