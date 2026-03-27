"use client";

import { Check, ChevronDown, SearchX } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAdminContext } from "@/lib/stored";
import type { IFormFieldProps } from "@/lib/types/common";
import { cn } from "@/lib/utils";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

const UserAdminCbxBField = ({
  name,
  className,
  hiddenLabel = false,
  isRequired = false,
  placeholder = "Chọn nhân viên",
}: IFormFieldProps) => {
  const { listUserAdmin } = useAdminContext();
  const form = useFormContext();

  const options = listUserAdmin.map((e) => ({
    label: e.Name,
    value: e.Id,
  }));

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {!hiddenLabel && (
            <FormLabel isRequired={isRequired}>Nhân viên</FormLabel>
          )}
          <Popover>
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between text-left min-w-0",
                    !field.value && "text-muted-foreground",
                    className
                  )}
                >
                  <span className="truncate flex-1">
                    {field.value
                      ? options.find((item) => item.value === field.value)
                          ?.label
                      : placeholder}
                  </span>
                  <ChevronDown className="opacity-50 flex-shrink-0 ml-2" />
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder={"Tìm kiếm..."} className="h-9" />
                <CommandList>
                  <CommandEmpty>
                    <div className="flex items-center justify-center gap-2 flex-col">
                      <SearchX className="w-8 h-8 text-muted-foreground" />
                      Không tìm thấy dữ liệu.
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option.value?.toString() || ""}
                        key={option.value}
                        onSelect={() => {
                          form.setValue(name, option.value);
                        }}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            option.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UserAdminCbxBField;
