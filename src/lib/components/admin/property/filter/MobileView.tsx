import { Checkbox, Drawer, Flex, Form, FormInstance, Input, Segmented } from "antd";
import { ListFilterPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  AdvPropSearch,
  AuctionCheckbox,
  CountRangeFilter,
  DateFilter,
  FloatingField,
} from "@/lib/components/shared/MyFormItem";
import {
  CustomerTypeSelect,
  DirectionSelect,
  FurnitureSelect,
  LawSelect,
  UserAdminSelect,
} from "@/lib/components/shared/MySelect";
import { ETransType } from "@/lib/core/enum";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { HIDDEN_FIELDS } from "./config";
import "./property-filter.css";

type MobileViewProps = {
  form: FormInstance<IPropAdminOpts>;
  model: IPropAdminOpts;
  handleRefresh: () => void;
};

export const MobileView = ({ form, model, handleRefresh }: MobileViewProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const searchParams = useSearchParams();

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const handleRefreshWithClose = () => {
    handleRefresh();
    setIsDrawerOpen(false);
  };

  const handleApply = () => {
    form.submit();
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
        title="Bộ lọc"
        placement="bottom"
        onClose={handleDrawerClose}
        open={isDrawerOpen}
        height="90vh"
        className="property-filter-mobile-drawer"
        footer={
          <Flex gap={12}>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleRefreshWithClose}
            >
              Đặt lại
            </Button>
            <Button type="button" className="w-full" onClick={handleApply}>
              Áp dụng
            </Button>
          </Flex>
        }
      >
        {HIDDEN_FIELDS.filter((e) => e !== "TransType").map((e) => (
          <Form.Item key={e} name={e} hidden>
            <Input />
          </Form.Item>
        ))}

        <Flex vertical gap={20}>
          <Form.Item name="TransType" noStyle>
            <Segmented
              block
              className="property-transtype-segmented"
              options={[
                { label: "Tìm mua", value: ETransType.sell },
                { label: "Tìm thuê", value: ETransType.rent },
              ]}
              value={model?.TransType || ETransType.sell}
              onChange={(val) => form.setFieldValue("TransType", val)}
            />
          </Form.Item>

          <CountRangeFilter
            form={form}
            label="Số tầng"
            nameFrm="FloorFrm"
            nameTo="FloorTo"
          />
          <CountRangeFilter
            form={form}
            label="Số phòng ngủ"
            nameFrm="BedroomFrm"
            nameTo="BedroomTo"
          />
          <CountRangeFilter
            form={form}
            label="Số phòng tắm, vệ sinh"
            nameFrm="BathroomFrm"
            nameTo="BathroomTo"
          />

          <Form.Item name="Direction" className="property-field-item">
            <FloatingField label="Hướng nhà" required>
              <DirectionSelect mode="multiple" placeholder="Chọn" />
            </FloatingField>
          </Form.Item>

          <Form.Item name="Legal" className="property-field-item">
            <FloatingField label="Pháp lý">
              <LawSelect placeholder="Chọn" allowClear />
            </FloatingField>
          </Form.Item>

          <Form.Item name="FurnitureIds" className="property-field-item">
            <FloatingField label="Nội thất">
              <FurnitureSelect mode="multiple" placeholder="Chọn" />
            </FloatingField>
          </Form.Item>

          <Form.Item name="CustomerType" className="property-field-item">
            <FloatingField label="Nhận diện khách hàng" required>
              <CustomerTypeSelect placeholder="Chọn" />
            </FloatingField>
          </Form.Item>

          <Flex gap={12}>
            <Form.Item name="UserAdminId" className="property-field-item" style={{ flex: 1 }}>
              <FloatingField label="Nhân viên" required>
                <UserAdminSelect placeholder="Chọn" />
              </FloatingField>
            </Form.Item>
            <div style={{ flex: 1 }}>
              <FloatingField label="Thời gian" required>
                <DateFilter form={form} />
              </FloatingField>
            </div>
          </Flex>

          <Flex gap={24}>
            <AuctionCheckbox form={form} />
            <Form.Item name="IsMonopoly" valuePropName="checked" noStyle>
              <Checkbox>Độc quyền</Checkbox>
            </Form.Item>
          </Flex>
        </Flex>
      </Drawer>
    </>
  );
};