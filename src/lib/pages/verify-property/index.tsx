"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FilterForm from "@/components/features/prop-transfer/filter-form";
import VerifyPropertyTable from "@/components/features/verify-property/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { objToQueryString } from "@/lib/core/utils/app-func";
import { parseQueryParams } from "@/lib/core/utils/query-parser";
import {
  EPropTransferType,
  type IPropTransferOpts,
  propTransferOptsSchema,
} from "@/services/property/models/prop-transfer";
import propTransferApi from "@/services/property/propTransferApi";

const DEFAULT_TYPE = EPropTransferType.AboveSegment;

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const VerifyPropertyPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [options, setOptions] = useState<IPropTransferOpts>({
    pageIndex: 1,
    pageSize: 10,
    Type: DEFAULT_TYPE,
  });

  const { data, isLoading } = propTransferApi.useGet(options);
  const { data: totalCount } = propTransferApi.useCount(options);

  useEffect(() => {
    const defaultOptions: IPropTransferOpts = {
      pageIndex: 1,
      pageSize: 10,
      Type: DEFAULT_TYPE,
    };

    const parsedOptions = parseQueryParams(
      searchParams,
      propTransferOptsSchema,
      defaultOptions
    );
    setOptions(parsedOptions);
  }, [searchParams]);

  const handleFilter = (values: IPropTransferOpts) => {
    router.push(
      `${pathname}?${objToQueryString({ ...values, Type: DEFAULT_TYPE })}`
    );
  };

  return (
    <Card className="rounded-sm shadow-none gap-4">
      <CardHeader>
        <FilterForm onSubmit={handleFilter} opts={options} />
        <CardTitle>
          <h2 className="uppercase text-lg">Kiểm duyệt bất động sản</h2>
        </CardTitle>
        <CardDescription>Tìm được {totalCount?.data} kết quả</CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyPropertyTable
          data={data?.data ?? []}
          isLoading={isLoading}
          totalCount={totalCount?.data ?? 0}
          opts={options}
          onPageIndexChange={(pageIndex, pageSize) => {
            handleFilter({ ...options, pageIndex, pageSize });
          }}
        />
      </CardContent>
    </Card>
  );
};

export default VerifyPropertyPage;
