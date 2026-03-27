"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import DistrictCbxField from "@/components/ui/form-field/district-cbx";
import WardCbxField from "@/components/ui/form-field/ward-cbx";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { ISuggestAddressDto } from "@/lib/interfaces/base/IBase";
import type { ISearchWardDto } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import utilsApi from "@/services/api/utilsApi";
import wardApi from "@/services/api/wardApi";

const ComboboxSearch = ({
  onSelect,
}: {
  onSelect: (suggestion: ISuggestAddressDto) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ISuggestAddressDto[]>([]);
  const [label, setLabel] = useState<string>();

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const response = await utilsApi.suggestAddress(debouncedSearch, "ward");
        if (response && response.data) {
          setSuggestions(
            response.data.filter(
              (item) => item.WardId !== 0 && item.WardId !== null
            )
          );
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
          className="w-full justify-between min-w-sm"
        >
          {label || <span className="text-muted-foreground">Chọn</span>}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-sm p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Tìm kiếm phường / xã..."
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
                  <MapPin className="mr-2 h-4 w-4" />
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

const schema = z.object({
  ProvinceId: z.coerce
    .number()
    .min(1, { message: "Vui lòng chọn Tỉnh / Thành phố" }),
  DistrictId: z.coerce
    .number()
    .min(1, { message: "Vui lòng chọn Quận / Huyện" }),
  WardId: z.coerce.number().min(1, { message: "Vui lòng chọn Phường / Xã" }),
});

const WardLookupDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [wards, setWards] = useState<ISearchWardDto[]>([]);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ProvinceId: 1,
      DistrictId: 0,
      WardId: 0,
    },
  });

  const onSubmit = async (data: any) => {
    const result = await wardApi.getMergedTo(data.WardId);
    if (result && result.data) {
      if (result.data.length === 0) {
        toast.warning("Không tìm thấy dữ liệu");
      }
      setWards(result.data);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onClose();
        form.reset();
        setWards([]);
      }}
    >
      <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>Tra cứu thông tin Phường / Xã mới</DialogTitle>
          <DialogDescription>
            Dữ liệu được cập nhật từ 01/07/2025
          </DialogDescription>
        </DialogHeader>{" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="grid gap-2">
                <DistrictCbxField
                  name="DistrictId"
                  parentName="ProvinceId"
                  className=" min-w-xs md:min-w-[200px]"
                />
              </div>
              <div className="grid gap-2">
                <Label>Phường / Xã cũ</Label>
                <WardCbxField
                  name="WardId"
                  parentName="DistrictId"
                  className=" min-w-xs md:min-w-[200px]"
                  hiddenLabel
                />
              </div>
              <Button className="w-fit md:mt-5.5" type="submit">
                <Search className="w-4 h-4" /> Tra cứu
              </Button>
            </div>
          </form>
        </Form>
        {wards.length > 0 && (
          <div className="flex flex-col space-y-4">
            {wards.map((ward) => (
              <div
                key={ward.WardId}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4"
              >
                <div className="grid gap-2">
                  <Label>Tên phường / xã mới:</Label>
                  <p>Phường {ward.WardName}</p>
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label>Sáp nhập từ:</Label>
                  <p>{ward.MergedFrom.join(", ")}</p>
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label>Trụ sở làm việc:</Label>
                  <p>{ward.Headquarters}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {form.formState.isSubmitting && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
        <DialogFooter className="hidden md:flex">
          <DialogClose asChild>
            <Button variant="outline" type="button" className="w-fit">
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WardLookupDialog;
