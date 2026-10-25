import {
  Checkbox,
  Drawer,
  Flex,
  Form,
  FormInstance,
  Input,
  Segmented,
} from "antd";
import { ListFilterPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  AdvPropSearch,
  AreaFilter,
  AuctionCheckbox,
  CountRangeFilter,
  DateFilter,
  FloatingField,
  PriceFilter,
} from "@/lib/components/shared/MyFormItem";
import {
  AddressSelectCustom,
  CustomerTypeSelect,
  DirectionSelect,
  FurnitureSelect,
  LawSelect,
  LocationSelectCustom,
  PropTypeSelect,
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
  mapMode?: boolean;
};

export const MobileView = ({
  form,
  model,
  handleRefresh,
  mapMode = false,
}: MobileViewProps) => {
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
            placeholder={
              mapMode ? "Tìm kiếm bất động sản" : "Tìm mã, tên, địa chỉ..."
            }
            showVoice={!mapMode}
            handleRefresh={handleRefreshWithClose}
          />
        </div>
        <Button
          size={"icon"}
          onClick={handleOpenDrawer}
          type="button"
          variant={"outline"}
          className="w-8 h-8"
          aria-label="Lọc thêm"
        >
          <ListFilterPlus />
        </Button>
      </div>

      <Drawer
        title="Bộ lọc"
        forceRender={mapMode}
        placement="bottom"
        onClose={handleDrawerClose}
        open={isDrawerOpen}
        height="90vh"
        className={`property-filter-mobile-drawer ${mapMode ? "property-filter-map-mobile-drawer" : ""}`}
        footer={
          <Flex gap={12}>
            <Button
              type="button"
              variant="outline"
              className={mapMode ? "min-w-0 flex-1" : "w-full"}
              onClick={handleRefreshWithClose}
            >
              Đặt lại
            </Button>
            <Button
              type="button"
              className={mapMode ? "min-w-0 flex-1" : "w-full"}
              onClick={handleApply}
            >
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

          {mapMode && (
            <div className="property-filter-map-mobile">
              <AddressSelectCustom
                form={form}
                nameProvince="ProvinceId"
                nameDistrict="DistrictId"
                nameWard="WardId"
                nameStreet="StreetId"
                nameAddressNumber="AddressNumber"
                mapMode
              />
              <LocationSelectCustom
                form={form}
                locationName="Location"
                locationFeatureName="LocationFeature"
                mapMode
              />
              <PriceFilter form={form} />
              <FloatingField label="Diện tích">
                <AreaFilter form={form} mapMode placeholder="Chọn" />
              </FloatingField>
              <FloatingField label="Loại BĐS">
                <Form.Item name="PropTypeIds" noStyle>
                  <PropTypeSelect mode="multiple" placeholder="Chọn" />
                </Form.Item>
              </FloatingField>
            </div>
          )}

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

          <div className="property-field-item">
            <FloatingField label="Hướng nhà" required>
              <Form.Item name="Direction" noStyle>
                <DirectionSelect mode="multiple" placeholder="Chọn" />
              </Form.Item>
            </FloatingField>
          </div>

          <div className="property-field-item">
            <FloatingField label="Pháp lý">
              <Form.Item name="Legal" noStyle>
                <LawSelect placeholder="Chọn" allowClear />
              </Form.Item>
            </FloatingField>
          </div>

          <div className="property-field-item">
            <FloatingField label="Nội thất">
              <Form.Item name="FurnitureIds" noStyle>
                <FurnitureSelect mode="multiple" placeholder="Chọn" />
              </Form.Item>
            </FloatingField>
          </div>

          <div className="property-field-item">
            <FloatingField label="Nhận diện khách hàng" required>
              <Form.Item name="CustomerType" noStyle>
                <CustomerTypeSelect placeholder="Chọn" />
              </Form.Item>
            </FloatingField>
          </div>

          <Flex gap={12}>
            <div className="property-field-item" style={{ flex: 1 }}>
              <FloatingField label="Nhân viên" required>
                <Form.Item name="UserAdminId" noStyle>
                  <UserAdminSelect placeholder="Chọn" />
                </Form.Item>
              </FloatingField>
            </div>
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
