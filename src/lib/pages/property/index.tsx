"use client";
import { Card, Checkbox, Typography } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PropertyFilter from "@/lib/components/admin/property/filter";
import { PropertyTable } from "@/lib/components/admin/property/table";
import { ETransType } from "@/lib/core/enum";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import propertyApi from "@/services/api/property/propertyApi";

type Props = {
  transType: ETransType;
};

// const transType = 1; // sell

const PropertyPage = ({ transType }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const searchOptions = {
    ...Object.fromEntries(query?.entries() ?? []),
    TransType: transType,
    ProvinceId: 1,
  } as any as IPropAdminOpts;

  const { data: meta } = propertyApi.useGetMeta(
    objToQueryString(searchOptions)
  );

  const handleFilter = (values: IPropAdminOpts) => {
    console.log("filter ", values);
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

  const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
    router.push(
      `${pathname}?${objToQueryString({
        ...searchOptions,
        pageIndex,
        pageSize,
      })}`
    );
  };

  const title =
    meta?.data.Title && meta.data.Title !== ""
      ? meta.data.Title
      : transType === ETransType.sell
      ? "Quản lý nhà bán"
      : "Quản lý nhà thuê";

  return (
    searchOptions && (
      <Card>
        <PropertyFilter onSubmit={handleFilter} model={searchOptions} />
        <div className="grid grid-cols-2 md:grid-cols-2 gap-1">
          <div className="col-span-2 md:col-span-1">
            <TitlePage title={title} />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Checkbox
              checked={searchOptions?.IsMonopoly ?? false}
              onChange={(e) => {
                handleFilter({
                  ...searchOptions,
                  IsMonopoly: e.target.checked === true ? true : undefined,
                });
              }}
            >
              <Typography.Text type="warning">Độc quyền</Typography.Text>
            </Checkbox>
            <Checkbox
              checked={Number(searchOptions?.CustomerType) === 6 ? true : false}
              onChange={(e) => {
                handleFilter({
                  ...searchOptions,
                  CustomerType: e.target.checked === true ? 6 : undefined,
                });
              }}
            >
              <Typography.Text type="warning">Đấu giá </Typography.Text>
            </Checkbox>
          </div>
          {/* {[1, 2].includes(session?.user?.RoleId ?? 0) && (
            <Col>
              <PropTransferDrawer />
            </Col>
          )} */}
        </div>
        <PropertyTable
          searchOptions={searchOptions}
          onPageIndexChange={handlePageIndexChange}
        />
        {/* <HappyBirthdayModal /> */}
      </Card>
    )
  );
};

export default PropertyPage;
