"use client";
import { Col, Radio, Row, Tabs, type TabsProps } from "antd";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import UserCollapseInfo from "@/components/features/user-admin/collapse-info";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { PropertyTable } from "@/lib/components/admin/property/table";
import PersonalDetail from "@/lib/components/admin/userAdmin/detail/personal";
import UserAdminEdit from "@/lib/components/admin/userAdmin/modal/userAdminEdit";
import ActivityTree from "@/lib/components/shared/ActivityTree";
import { baseFilter } from "@/lib/core/configs/appConst";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";
import type { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import type { IUserAdminResponse } from "@/services/api/userAdmin/IUserAdmin";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";

type Props = {
  id: string;
};

const UserAdminDetailPage = ({ id }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<IUserAdminResponse>();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [options, setOptions] = useState<IPropAdminOpts>({
    ...baseFilter,
    TransType: ETransType.sell,
    UserAdminId: Number(id),
  });
  const [cartOpts, setCartOpts] = useState<IPropAdminOpts>({
    ...baseFilter,
    IsSaved: true,
    TransType: ETransType.sell,
    UserAdminId: Number(id),
  });

  const items: TabsProps["items"] = useMemo(() => {
    const handlePageIndexChange = (pageIndex: number, pageSize: number) => {
      setOptions({
        ...options,
        pageIndex,
        pageSize,
      });
    };

    return [
      {
        key: "1",
        label: `BĐS của bạn`,
        children: (
          <Row>
            <Col span={24}>
              <Radio.Group
                onChange={(e) =>
                  setOptions({ ...options, TransType: e.target.value })
                }
                value={options.TransType}
              >
                <Radio value={ETransType.sell}>Mua bán</Radio>
                <Radio value={ETransType.rent}>Cho thuê</Radio>
              </Radio.Group>
            </Col>
            <Col span={24}>
              <PropertyTable
                searchOptions={options}
                onPageIndexChange={handlePageIndexChange}
              />
            </Col>
          </Row>
        ),
      },
      {
        key: "2",
        label: `Giỏ hàng`,
        children: (
          <Row>
            <Col span={24}>
              <Radio.Group
                onChange={(e) =>
                  setCartOpts({ ...cartOpts, TransType: e.target.value })
                }
                value={cartOpts.TransType}
              >
                <Radio value={ETransType.sell}>Mua bán</Radio>
                <Radio value={ETransType.rent}>Cho thuê</Radio>
              </Radio.Group>
            </Col>
            <Col span={24}>
              <PropertyTable
                isPropCart
                searchOptions={cartOpts}
                onPageIndexChange={() => {}}
              />
            </Col>
          </Row>
        ),
      },

      {
        key: "4",
        label: `Khách hàng`,
        children: `Chưa có dữ liệu`,
      },

      {
        key: "5",
        label: `Thông tin cá nhân`,
        children: data && <PersonalDetail data={data} />,
      },
      {
        key: "6",
        label: `Lịch sử hoạt động`,
        children: data && <ActivityTree userId={data.Id ?? 0} />,
      },
    ];
  }, [options, cartOpts, data]);

  const onChange = (key: string) => {
    console.log(key);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await userAdminApi.getById(Number(id));
      if (!result.data) {
        router.push("/404");
      }
      setData(result.data);
    };
    fetchData();
  }, [id, router]);

  return (
    data && (
      <div className="space-y-6 p-4">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin tài khoản và danh sách BDS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                session?.user.Id === data.Id && session?.user.RoleId === 3
                  ? setOpenModalEdit(true)
                  : router.push(`${AppRoutes.userAdmin.url}/edit/${id}`);
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="hidden md:block">Chỉnh sửa</span>
            </Button>
            {/* <Button variant="outline">
              <History className="h-4 w-4" />
              <span className="hidden md:block">Lịch sử hoạt động</span>
            </Button> */}
          </div>
        </div>

        <UserCollapseInfo data={data} />
        <Card>
          <CardContent>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </CardContent>
        </Card>

        {data && (
          <UserAdminEdit
            isModalOpen={openModalEdit}
            handleCancel={() => setOpenModalEdit(false)}
            model={data}
          />
        )}
      </div>
    )
  );

  // return (
  //   data && (
  //     <Row gutter={12}>
  //       <Col xs={24} md={24} lg={6}>
  //         <UserAdminInfo data={data} />
  //       </Col>
  //       <Col xs={24} md={24} lg={18}>
  //         <Card>
  //           <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  //         </Card>
  //       </Col>
  //     </Row>
  //   )
  // );
};

export default UserAdminDetailPage;
