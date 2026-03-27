"use client";

import {
  ChevronsUpDown,
  HandCoinsIcon,
  Home,
  House,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LimitAccessPropTable from "@/lib/components/admin/property/table/limit-access-table";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { ISuggestAddressDto } from "@/lib/interfaces/base/IBase";
import type { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import type { IPropCheckAddress } from "@/lib/interfaces/Property/IProp";
import { usePropStore } from "@/lib/stored";
import propertyApi from "@/services/api/property/propertyApi";
import utilsApi from "@/services/api/utilsApi";
import { baseFilter } from "../../configs/appConst";
import { AppRoutes } from "../../configs/appRoutes";
import { ETransType } from "../../enum";

const ComboboxSearch = ({
  onSelect,
}: {
  onSelect: (suggestion: ISuggestAddressDto) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<ISuggestAddressDto[]>(
    []
  );
  const [label, setLabel] = React.useState<string>();

  const debouncedSearch = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const response = await utilsApi.suggestAddress(
          debouncedSearch,
          "street"
        );
        if (response && response.data) {
          setSuggestions(response.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-l-none border-l-0"
        >
          {label || (
            <span className="text-muted-foreground">Tìm kiếm địa chỉ...</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Tìm kiếm địa chỉ..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />

          <CommandList>
            {isLoading ? (
              <CommandEmpty>Đang tìm kiếm...</CommandEmpty>
            ) : suggestions.length === 0 ? (
              <CommandEmpty>Không tìm thấy dữ liệu</CommandEmpty>
            ) : (
              suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.FullName}
                  onSelect={() => {
                    setLabel(suggestion.FullName);
                    onSelect(suggestion);
                    setOpen(false);
                  }}
                >
                  <House className="mr-2 h-4 w-4" />
                  <span>{suggestion.FullName}</span>
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const HistoryCommand = ({
  data,
  handleOpen,
  transType,
}: {
  data: ISuggestAddressDto[];
  handleOpen: (open: boolean) => void;
  transType: string;
}) => {
  const router = useRouter();

  return (
    <Command shouldFilter={false} className="bg-gray-50">
      <CommandList>
        <CommandGroup heading="Tìm kiếm gần đây">
          <CommandEmpty>Không tìm thấy dữ liệu</CommandEmpty>

          {data.length > 0 &&
            data.map((item) => (
              <CommandItem
                key={item.FullName}
                onSelect={() => {
                  let url = `${AppRoutes.property.url}?TransType=${transType}&ProvinceId=${item.ProvinceId}&DistrictId=${item.DistrictId}`;
                  if (item.WardId > 0) {
                    url += `&WardId=${item.WardId}`;
                  }
                  if (item.StreetId > 0) {
                    url += `&StreetId=${item.StreetId}`;
                  }
                  router.push(url);
                  handleOpen(false);
                }}
              >
                <span>{item.FullName}</span>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const SearchCommand = ({ isIconOnly = false }: { isIconOnly?: boolean }) => {
  const router = useRouter();
  const [opts, setOpts] = React.useState<IPropAdminOpts>({
    ...baseFilter,
    pageSize: 10,
    TransType: ETransType.sell,
  });
  const { searchHistories, onSearchHistoryChange } = usePropStore();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [checkAddress, setCheckAddress] = React.useState<{
    Duplicate: IPropCheckAddress[];
    OppositeTransType: IPropCheckAddress[];
  }>();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = async (model: IPropAdminOpts) => {
    try {
      if (!model.AddressNumber || model.AddressNumber.trim() === "") {
        NotiBase("error", "Vui lòng nhập số nhà");
        return;
      }

      setIsLoading(true);
      const res = await propertyApi.checkAddress(model);
      setCheckAddress(res.data);
    } catch (error) {
      console.error(error);
      NotiBase("error", error?.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isIconOnly ? (
        <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
          <Search className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="shadow-none justify-between"
        >
          <div className="flex items-center gap-2">
            <Search />
            <span>Tìm kiếm bất động sản</span>
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">Ctrl + J</span>
          </kbd>
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-[1000px] ">
          <DialogHeader>
            <DialogTitle>Tìm kiếm bất động sản</DialogTitle>
          </DialogHeader>
          <Tabs
            className="w-full"
            onValueChange={(value) => {
              setOpts({ ...opts, TransType: Number(value) as ETransType });
              if (opts.AddressNumber && opts.AddressNumber.trim() !== "") {
                handleSearch({
                  ...opts,
                  TransType: Number(value) as ETransType,
                });
              }
            }}
            value={opts.TransType.toString()}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={ETransType.sell.toString()}>
                <Home className="h-3 w-3 mr-1" />
                Mua bán
              </TabsTrigger>
              <TabsTrigger value={ETransType.rent.toString()}>
                <HandCoinsIcon className="h-3 w-3 mr-1" />
                Cho thuê
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-full md:col-span-1 md:border-r">
              <HistoryCommand
                data={searchHistories}
                handleOpen={setOpen}
                transType={opts.TransType.toString()}
              />
            </div>
            <div className="col-span-full md:col-span-2 space-y-3 overflow-y-auto max-h-[60vh] min-h-[300px]">
              <div className="flex md:gap-2">
                <div className="flex flex-1">
                  <Input
                    placeholder="Số nhà"
                    className="w-[120px] rounded-r-none"
                    value={opts.AddressNumber}
                    onChange={(e) =>
                      setOpts({ ...opts, AddressNumber: e.target.value })
                    }
                  />
                  <ComboboxSearch
                    onSelect={(suggestion) => {
                      onSearchHistoryChange(suggestion);
                      setOpts({
                        ...opts,
                        DistrictId: suggestion.DistrictId,
                        WardId:
                          suggestion.WardId > 0 ? suggestion.WardId : undefined,
                        StreetId:
                          suggestion.StreetId > 0
                            ? suggestion.StreetId
                            : undefined,
                      });
                    }}
                  />
                </div>
                <Button variant="outline" onClick={() => handleSearch(opts)}>
                  <Search />
                  Tìm
                </Button>
              </div>
              {checkAddress ? (
                <LimitAccessPropTable
                  data={checkAddress?.Duplicate || []}
                  loading={isLoading}
                  onAdd={() => {
                    //check opts undefined will not apply to url
                    let url = `${AppRoutes.property.url}/add?TransType=${opts.TransType}&AddressNumber=${opts.AddressNumber}`;
                    if (opts.ProvinceId) {
                      url += `&ProvinceId=${opts.ProvinceId}`;
                    }
                    if (opts.DistrictId) {
                      url += `&DistrictId=${opts.DistrictId}`;
                    }
                    if (opts.WardId) {
                      url += `&WardId=${opts.WardId}`;
                    }
                    if (opts.StreetId) {
                      url += `&StreetId=${opts.StreetId}`;
                    }
                    router.push(url);
                    setOpen(false);
                  }}
                />
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2" />
                  <p>
                    Hỗ trợ tìm kiếm, kiểm tra bất động sản đã có trên hệ thống
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchCommand;
