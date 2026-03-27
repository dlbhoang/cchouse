import { Form } from "antd";
import { useEffect } from "react";
import { baseFilter } from "@/lib/core/configs/appConst";
import { convertToNumber } from "@/lib/core/utils/myFormat";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";

export const usePropertyFilter = (
  model: IPropAdminOpts,
  onSubmit: (values: IPropAdminOpts) => void
) => {
  const [form] = Form.useForm<IPropAdminOpts>();

  const handleRefresh = () => {
    form.resetFields();
    onSubmit({
      ...baseFilter,
      Status: [1],
      TransType: model.TransType,
    });
  };

  useEffect(() => {
    if (model) {
      form.setFieldsValue({
        ...model,
        search: model.search,
        Status: model.Status?.toString()
          .split(",")
          .map((e) => Number(e)) ?? [1],
        PropTypeIds:
          model.PropTypeIds?.toString()
            .split(",")
            .map((e) => Number(e)) ?? undefined,
        Direction:
          model.Direction?.toString()
            .split(",")
            .map((e) => Number(e)) ?? undefined,
        UserAdminId: convertToNumber(model.UserAdminId),
        CustomerType: convertToNumber(model.CustomerType),
        Location: convertToNumber(model.Location),
        LocationFeature: convertToNumber(model.LocationFeature),
        ProvinceId: convertToNumber(model.ProvinceId),
        DistrictId: convertToNumber(model.DistrictId),
        WardId: convertToNumber(model.WardId),
        StreetId: convertToNumber(model.StreetId),
        PriceFrm: convertToNumber(model.PriceFrm),
        PriceTo: convertToNumber(model.PriceTo),
        AreaFrm: convertToNumber(model.AreaFrm),
        AreaTo: convertToNumber(model.AreaTo),
        FloorAreaFrm: convertToNumber(model.FloorAreaFrm),
        FloorAreaTo: convertToNumber(model.FloorAreaTo),
        LengthFrm: convertToNumber(model.LengthFrm),
        LengthTo: convertToNumber(model.LengthTo),
        WidthFrm: convertToNumber(model.WidthFrm),
        WidthTo: convertToNumber(model.WidthTo),
      });
    }
  }, [form, model]);

  return {
    form,
    handleRefresh,
  };
};
