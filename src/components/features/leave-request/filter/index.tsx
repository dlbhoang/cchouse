"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListFilter, RefreshCcw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DateRangeFilter } from "@/components/ui/form-field/date-range-filter";
import SearchInputField from "@/components/ui/form-field/search-input";
import UserAdminCbxBField from "@/components/ui/form-field/user-admin-cbx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import StatusSelectField from "../common/status-select";
import { type ILeaveQuery, leaveQuerySchema } from "../types/leave-query";

type Props = {
  onSubmit: (values: ILeaveQuery) => void;
  opts: ILeaveQuery;
};

const FilterForm = ({ onSubmit, opts }: Props) => {
  console.log("🚀 ~ FilterForm ~ opts:", opts);
  const isMobile = useIsMobile();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const form = useForm<ILeaveQuery>({
    resolver: zodResolver(leaveQuerySchema),
    values: opts,
  });

  // Count active filters
  const activeFilterCount = useMemo(() => {
    const values = form.getValues();
    let count = 0;

    // Check search
    if (values.search && values.search.trim() !== "") count++;

    // Check date range
    if (values.fromDate || values.toDate) count++;

    // Check status
    if (values.Status !== undefined && values.Status !== null) count++;

    // Check user request
    if (values.UserRequestId !== undefined && values.UserRequestId !== null)
      count++;

    return count;
  }, [form.watch()]);

  const handleReset = () => {
    console.log("🚀 ~ FilterForm reset");
    const resetValues = { pageIndex: 1, pageSize: 20 };
    form.reset(resetValues);
    onSubmit(resetValues);
    setIsFilterOpen(false);
  };

  const FilterContent = () => {
    const handleSubmit = (values: ILeaveQuery) => {
      console.log("🚀 ~ FilterForm submit ~ values:", values);
      // Ensure we have default values
      const submitValues = {
        pageIndex: 1,
        pageSize: 20,
        ...values,
      };
      onSubmit(submitValues);
    };

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-center"
        >
          <div className="col-span-1">
            <StatusSelectField name="Status" hiddenLabel className="w-full" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <UserAdminCbxBField
              name="UserRequestId"
              hiddenLabel
              placeholder="Người tạo"
            />
          </div>
          <div className="col-span-2">
            <DateRangeFilter
              name="dateRange"
              fromDateName="fromDate"
              toDateName="toDate"
            />
          </div>
          <div className="col-span-2 md:col-span-3">
            <SearchInputField
              name="search"
              onReset={handleReset}
              inputOnly={isMobile}
            />
          </div>
          <div className="col-span-2 flex gap-2 md:hidden">
            <Button type="submit" className="flex-1">
              <Search className="w-4 h-4" />
              Tìm kiếm
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleReset}
            >
              <RefreshCcw className="w-4 h-4 " />
              Đặt lại
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  if (isMobile) {
    return (
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <div className="flex justify-between items-center">
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative w-fit">
              <ListFilter className="w-4 h-4" />
              Bộ lọc
              {activeFilterCount > 0 && (
                <Badge
                  variant="warning"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          {activeFilterCount > 0 && (
            <span className="text-sm text-amber-500 flex items-center gap-2">
              <X className="w-4 h-4" onClick={handleReset} />
              Đang áp dụng {activeFilterCount} bộ lọc
            </span>
          )}
        </div>
        <SheetContent side="bottom" className="h-[700px]">
          <SheetHeader>
            <SheetTitle className="uppercase">Bộ lọc tìm kiếm</SheetTitle>
            <SheetDescription>
              Sử dụng các bộ lọc để tìm kiếm chính xác hơn
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return <FilterContent />;
};

export default FilterForm;
