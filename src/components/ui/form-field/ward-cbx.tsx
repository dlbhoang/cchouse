"use client";

import { Check, ChevronDown, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { IWardResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import type { IFormFieldProps } from "@/lib/types/common";
import { cn } from "@/lib/utils";
import wardApi from "@/services/api/wardApi";
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

const WardCbxField = ({
  name,
  className,
  hiddenLabel = false,
  isRequired = false,
  placeholder = "Chọn",
  parentName,
  isNew = false,
}: IFormFieldProps & {
  parentName: string;
  isNew?: boolean;
}) => {
  const label = "Phường / Xã";

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IWardResponse[]>([]);
  const form = useFormContext();

  const districtId = form.watch(parentName);

  useEffect(() => {
    if (districtId) {
      setLoading(true);
      const fetchData = async () => {
        const result = await wardApi.get({
          DistrictId: districtId,
          pageIndex: 1,
          pageSize: 10000,
          IsNew: isNew,
        });
        setData(result.data);
        setLoading(false);
      };

      fetchData();
    }
  }, [districtId]);

  const options = data.map((e) => ({
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
          <Popover modal={true}>
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
            <PopoverContent className="w-[200px] p-0">
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

export default WardCbxField;
