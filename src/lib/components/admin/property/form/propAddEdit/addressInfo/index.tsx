import { Col, Form, FormInstance, Input } from "antd";
import { useState } from "react";

import { AddressInfo } from "@/lib/components/shared/MyFormItem";
import {
  DistrictSelect,
  StreetSelect,
  WardSelect,
} from "@/lib/components/shared/MySelect";
import { IPropRequest, IPropResponse } from "@/lib/interfaces/Property/IProp";
import { IPropAddressBase } from "@/lib/interfaces/base/IPropAddressBase";
import { useAdminContext } from "@/lib/stored";
import PropertyCheckAddress from "../../../modal/checkAddress";

type Props = {
  form: FormInstance<IPropRequest>;
  model?: IPropResponse;
  isFull: boolean;
};
const PropAddressInfo = ({ form, model, isFull }: Props) => {
  const transType = form.getFieldValue("TransType");
  const propTypeWatch = Form.useWatch(["PropAddress", "PropTypeId"], form);
  const { propType } = useAdminContext();

  const [showOld, setShowOld] = useState(
    !!model?.PropAddress?.OldAddressNumber ||
      !!model?.PropAddress?.OldStreetId ||
      !!model?.PropAddress?.OldWardId ||
      !!model?.PropAddress?.OldDistrictId
  );
  const [district, setDistrict] = useState<string | undefined>(
    model?.PropAddress?.OldDistrictId?.toString()
  );

  return (
    <div>
      <AddressInfo
        isLand={propType
          .find((x) => x.Id === Number(propTypeWatch))
          ?.Name?.toLowerCase()
          .includes("đất")}
        colNumber={3}
        form={form}
        model={{ ...model?.PropAddress } as IPropAddressBase}
        items={{
          ProvinceItem: ["PropAddress", "ProvinceId"],
          DistrictItem: ["PropAddress", "DistrictId"],
          WardItem: ["PropAddress", "WardId"],
          StreetItem: ["PropAddress", "StreetId"],
          AddressNumberItem: ["PropAddress", "AddressNumber"],
          SubAddressItem: ["PropAddress", "SubAddress"],
          DirectionItem: ["PropAddress", "Direction"],
          ShowAddressNumberItem: [],
          LandNumberItem: ["PropAddress", "LandNumber"],
          MapNumberItem: ["PropAddress", "MapNumber"],
        }}
        hasOldAddress
        onShowOldAddress={() => setShowOld(!showOld)}
        rightChildren={
          showOld && (
            <>
              <Col lg={6} xl={6} xs={24}>
                <Form.Item
                  label="Quận / Huyện (cũ)"
                  name={["PropAddress", "OldDistrictId"]}
                >
                  <DistrictSelect
                    parentVal={model?.PropAddress?.ProvinceId?.toString()}
                    onChange={(val) => {
                      form.resetFields([
                        ["PropAddress", "OldWardId"],
                        ["PropAddress", "OldStreetId"],
                      ]);
                      setDistrict(val?.toString());
                    }}
                  />
                </Form.Item>
              </Col>
              <Col lg={6} xl={6} xs={24}>
                <Form.Item
                  label="Phường / Xã (cũ)"
                  name={["PropAddress", "OldWardId"]}
                >
                  <WardSelect parentVal={district} />
                </Form.Item>
              </Col>
              <Col lg={6} xl={6} xs={24}>
                <Form.Item
                  label="Số nhà (cũ)"
                  name={["PropAddress", "OldAddressNumber"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={6} xl={6} xs={24}>
                <Form.Item
                  label="Đường (cũ)"
                  name={["PropAddress", "OldStreetId"]}
                >
                  <StreetSelect parentVal={district} />
                </Form.Item>
              </Col>
            </>
          )
        }
      />

      <PropertyCheckAddress
        form={form}
        model={model}
        transType={model?.TransType ?? transType}
      />
    </div>
  );
};

export default PropAddressInfo;
