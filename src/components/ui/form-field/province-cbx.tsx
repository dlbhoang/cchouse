"use client";

import { Check, ChevronDown, SearchX } from "lucide-react";
import { useState } from "react";
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

const HCM_PROVINCE_IDS = [1];

const ProvinceCbxField = ({
  name,
  className,
  hiddenLabel = false,
  isRequired = false,
  placeholder = "Chọn",
  onlyHCM = false,
  popoverModal = true,
  portalContainer,
}: IFormFieldProps & {
  onlyHCM?: boolean;
  popoverModal?: boolean;
  portalContainer?: React.RefObject<HTMLElement | null>;
}) => {
  const label = "Tỉnh / Thành phố";

  const { provinces } = useAdminContext();
  const form = useFormContext();
  const [open, setOpen] = useState(false);

  const options = provinces
    .filter((e) => !onlyHCM || HCM_PROVINCE_IDS.includes(e.Id))
    .map((e) => ({
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
            <FormLabel isRequired={isRequired}>{label}</FormLabel>
          )}
          <Popover modal={popoverModal} open={open} onOpenChange={setOpen}>
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "justify-between text-left min-w-0",
                    !field.value && placeholder && "text-muted-foreground",
                    className
                  )}
                >
                  <span className="truncate flex-1">
                    {Number(field.value) > 0
                      ? options.find(
                          (item) => Number(item.value) === Number(field.value)
                        )?.label
                      : placeholder}
                  </span>
                  <ChevronDown className="opacity-50 flex-shrink-0 ml-2" />
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent
              container={portalContainer?.current}
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
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
                        keywords={[option.label]}
                        className="rounded-lg cursor-pointer data-[selected=true]:bg-[#E8F4FE] data-[selected=true]:text-[#0588F0]"
                        onSelect={() => {
                          field.onChange(option.value);
                          setOpen(false);
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

export default ProvinceCbxField;
