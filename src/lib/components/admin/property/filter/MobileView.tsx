import { Col, Drawer, Form, FormInstance, Input, Row } from "antd";
import { ListFilterPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  AdvPropSearch,
  AreaFilter,
  DateFilter,
  PriceFilter,
} from "@/lib/components/shared/MyFormItem";
import {
  AddressSelectCustom,
  CustomerTypeSelect,
  DirectionSelect,
  LocationSelectCustom,
  PropTypeSelect,
  TransStatusSelect,
  UserAdminSelect,
} from "@/lib/components/shared/MySelect";
import { ETransType } from "@/lib/core/enum";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { COL_STYLE, HIDDEN_FIELDS } from "./config";

type MobileViewProps = {
  form: FormInstance<IPropAdminOpts>;
  model: IPropAdminOpts;
  handleRefresh: () => void;
};

export const MobileView = ({ form, model, handleRefresh }: MobileViewProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const searchParams = useSearchParams();
  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // Custom refresh handler that closes the drawer
  const handleRefreshWithClose = () => {
    handleRefresh();
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (searchParams?.toString() !== "") {
      setIsDrawerOpen(false);
    }
  }, [searchParams]);

  return (
    <>
      <div className="flex gap-1">
        <div className="flex-1">
          <AdvPropSearch
            form={form}
            placeholder="Tìm mã, tên, địa chỉ..."
            handleRefresh={handleRefreshWithClose}
          />
        </div>
        <Button
          size={"icon"}
          onClick={handleOpenDrawer}
          type="button"
          variant={"outline"}
          className="w-8 h-8"
        >
          <ListFilterPlus />
        </Button>
      </div>
      <Drawer
        title="Bộ lọc nâng cao"
        placement="bottom"
        onClose={handleDrawerClose}
        open={isDrawerOpen}
        height="90vh"
      >
        <Row gutter={12}>
          {HIDDEN_FIELDS.map((e) => (
            <Form.Item key={e} name={e} hidden>
              <Input />
            </Form.Item>
          ))}

          <Col xs={24} lg={12} xl={8}>
            <AdvPropSearch
              form={form}
              placeholder="Tìm mã, tên, địa chỉ..."
              handleRefresh={handleRefresh}
            />
          </Col>
          <Col {...COL_STYLE}>
            <Form.Item name="Status">
              <TransStatusSelect
                mode="multiple"
                transType={model?.TransType || ETransType.sell}
              />
            </Form.Item>
          </Col>
          <Col {...COL_STYLE}>
            <LocationSelectCustom
              form={form}
              locationName="Location"
              locationFeatureName="LocationFeature"
            />
          </Col>
          <Col xs={24} lg={12} xl={4}>
            <Form.Item>
              <AddressSelectCustom
                form={form}
                nameProvince="ProvinceId"
                nameDistrict="DistrictId"
                nameWard="WardId"
                nameStreet="StreetId"
                nameAddressNumber="AddressNumber"
              />
            </Form.Item>
          </Col>
          <Col {...COL_STYLE}>
            <Form.Item name="CustomerType">
              <CustomerTypeSelect />
            </Form.Item>
          </Col>
          <Col {...COL_STYLE}>
            <Form.Item name="Direction">
              <DirectionSelect mode="multiple" />
            </Form.Item>
          </Col>
          <Col {...COL_STYLE}>
            <Form.Item name="PropTypeIds">
              <PropTypeSelect mode="multiple" />
            </Form.Item>
          </Col>
          <Col {...COL_STYLE}>
            <PriceFilter form={form} />
          </Col>
          <Col {...COL_STYLE}>
            <Form.Item name="">
              <AreaFilter form={form} />
            </Form.Item>
          </Col>
          <Col {...COL_STYLE}>
            <Form.Item name="UserAdminId">
              <UserAdminSelect />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <DateFilter form={form} />
          </Col>
        </Row>
      </Drawer>
    </>
  );
};
