"use client";
import { Col, Row } from "antd";
import { usePathname, useRouter } from "next/navigation";
import UserWebsiteFilter from "@/lib/components/admin/userWebsite/filter";
import UserWebsiteList from "@/lib/components/admin/userWebsite/list";
import { baseFilter } from "@/lib/core/configs/appConst";
import { objToQueryString } from "@/lib/core/utils/app-func";
import type { IUserWebsiteOpts } from "@/services/api/userWebsite/model";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const UserWebsitePage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const opts = {
    ...searchParams,
    pageIndex: searchParams?.pageIndex
      ? Number(searchParams.pageIndex)
      : baseFilter.pageIndex,
    pageSize: searchParams?.pageSize
      ? Number(searchParams.pageSize)
      : baseFilter.pageSize,
    Status: searchParams?.Status ? Number(searchParams.Status) : undefined,
    Type: searchParams?.Type ? Number(searchParams.Type) : undefined,
  } as IUserWebsiteOpts;

  const handleFilter = (values: IUserWebsiteOpts) => {
    router.push(`${pathname}?${objToQueryString(values)}`);
  };

  const mode = searchParams?.view === "card" ? "card" : "list";

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24}>
        <UserWebsiteFilter model={opts} onSubmit={handleFilter} />
      </Col>
      <Col xs={24}>
        <UserWebsiteList opts={opts} mode={mode} />
      </Col>
    </Row>
  );
};

export default UserWebsitePage;
