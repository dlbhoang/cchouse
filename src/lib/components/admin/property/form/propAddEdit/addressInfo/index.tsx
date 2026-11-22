import { Alert, Button, Col, Form, type FormInstance, Input, Row, Select, Space, Switch, Typography } from "antd";
import { useEffect, useRef, useState } from "react";

import { DirectionSelect, DistrictSelect, ProvinceSelect, StreetSelect, WardSelect } from "@/lib/components/shared/MySelect";
import { SubAddressSelect } from "@/lib/components/shared/MySelect/Property/SubAddressSelect";
import type { IPropRequest, IPropResponse } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import mergeWardApi from "@/services/api/mergeWardApi";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";
import PropertyCheckAddress from "../../../modal/checkAddress";

type Props = { form: FormInstance<IPropRequest>; model?: IPropResponse; isFull: boolean };
type Candidate = { WardId: number; WardName: string; DistrictId: number; DistrictName: string; Description?: string };
const addressField = <K extends keyof IPropRequest["PropAddress"]>(name: K): ["PropAddress", K] => ["PropAddress", name];

// shortcut: use a visible note line until the property API provides a second street field.
const streetLine = /^Tên đường thứ hai: ([^\r\n]*)$/m;

const PropAddressInfo = ({ form, model }: Props) => {
  const { propType } = useAdminContext();
  const propTypeId = Form.useWatch(addressField("PropTypeId"), form);
  const isLand = propType.find((item) => item.Id === Number(propTypeId))?.Name?.toLowerCase().includes("đất");
  const [after, setAfter] = useState(Boolean(model?.Id && !model.PropAddress?.OldWardId));
  const [showOld, setShowOld] = useState(Boolean(model?.PropAddress?.OldWardId));
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [notice, setNotice] = useState("");
  const oldRequestId = useRef(0);
  const newRequestId = useRef(0);
  const province = Form.useWatch(addressField("ProvinceId"), form);
  const oldDistrict = Form.useWatch(addressField("OldDistrictId"), form);
  const ward = Form.useWatch(addressField("WardId"), form);
  const oldWard = Form.useWatch(addressField("OldWardId"), form);
  const oldStreet = Form.useWatch(addressField("OldStreetId"), form);
  const oldNumber = Form.useWatch(addressField("OldAddressNumber"), form);
  const note: string = Form.useWatch("Note", form) ?? "";
  const transType = Form.useWatch("TransType", form);

  useEffect(() => {
    if (model?.Id) {
      setShowOld(Boolean(model.PropAddress?.OldWardId));
      setAfter(!model.PropAddress?.OldWardId);
    }
  }, [model?.Id, model?.PropAddress?.OldWardId]);

  useEffect(() => {
    const id = ++oldRequestId.current;
    if (after) return;
    setCandidates([]);
    setNotice("");
    if (!oldWard) return;
    const convert = async () => {
      try {
        const result = await wardApi.convertOldAddress({
          OldWardId: Number(oldWard),
          OldDistrictId: oldDistrict ? Number(oldDistrict) : undefined,
          OldStreetId: oldStreet ? Number(oldStreet) : undefined,
          AddressNumber: typeof oldNumber === "string" ? oldNumber : undefined,
        });
        if (id !== oldRequestId.current) return;
        const converted = result.data;
        setCandidates(converted.IsAmbiguous ? converted.Candidates : []);
        form.setFieldValue(addressField("AddressNumber"), oldNumber || "");
        if (converted.IsAmbiguous) {
          form.setFieldValue(addressField("WardId"), undefined);
          setNotice("Địa chỉ cũ thuộc nhiều phường mới. Chọn phường đúng trước khi lưu.");
        } else {
          form.setFieldsValue({ PropAddress: {
            ...form.getFieldValue("PropAddress"),
            ProvinceId: converted.ProvinceId,
            DistrictId: converted.NewDistrictId,
            WardId: converted.NewWardId,
          } });
          setNotice(converted.NewFullAddress || "");
        }
        if (oldStreet && converted.StreetName) {
          const streets = await streetApi.get({ ProvinceId: String(converted.ProvinceId), IsNew: true, pageIndex: 1, pageSize: 10000 });
          if (id !== oldRequestId.current) return;
          const match = streets.data?.find((item) => item.Name.trim().toLocaleLowerCase("vi") === converted.StreetName.trim().toLocaleLowerCase("vi"));
          form.setFieldValue(addressField("StreetId"), match?.Id);
          if (!match) setNotice("Đã đổi phường; vui lòng chọn tên đường sau sáp nhập.");
        }
      } catch {
        if (id === oldRequestId.current) { setCandidates([]); setNotice("Không thể chuyển đổi địa chỉ này. Kiểm tra lại địa chỉ cũ."); }
      }
    };
    void convert();
  }, [after, oldWard, oldDistrict, oldStreet, oldNumber, form]);

  useEffect(() => {
    const id = ++newRequestId.current;
    if (!after) return;
    setCandidates([]);
    setNotice("");
    if (!ward) return;
    const convert = async () => {
      try {
        const [result, selectedWard] = await Promise.all([mergeWardApi.get(Number(ward)), wardApi.getById(Number(ward))]);
        if (id !== newRequestId.current) return;
        if (selectedWard.data?.DistrictId) form.setFieldValue(addressField("DistrictId"), selectedWard.data.DistrictId);
        const matchingRows = (result.data || []).filter((item) => item.NewWardId === Number(ward));
        if (matchingRows[0]?.NewDistrictId) form.setFieldValue(addressField("DistrictId"), matchingRows[0].NewDistrictId);
        const choices = matchingRows
          .map((item) => ({ WardId: item.OldWardId, WardName: item.OldWardName, DistrictId: item.OldDistrictId, DistrictName: item.OldDistrictName, Description: item.Description }));
        setCandidates(choices.length > 1 ? choices : []);
        if (choices.length === 1) {
          form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), OldDistrictId: choices[0].DistrictId, OldWardId: choices[0].WardId } });
          setNotice(`Trước sáp nhập: ${choices[0].WardName}, ${choices[0].DistrictName}`);
        } else if (choices.length > 1) {
          form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), OldDistrictId: undefined, OldWardId: undefined } });
          setNotice("Có nhiều địa chỉ cũ tương ứng. Chọn phường cũ đúng trước khi lưu.");
        } else {
          setNotice("Không tìm thấy địa chỉ cũ tương ứng. Có thể nhập địa chỉ cũ thủ công.");
        }
      } catch {
        if (id === newRequestId.current) setNotice("Không thể tra cứu địa chỉ cũ lúc này.");
      }
    };
    void convert();
  }, [after, ward, form]);

  const oldFields = <>
    <Col xs={24} lg={6}><Form.Item label="Quận / huyện (cũ)" name={addressField("OldDistrictId")} rules={!after ? [{ required: true }] : undefined}><DistrictSelect parentVal={province?.toString()} onChange={() => form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), OldWardId: undefined, OldStreetId: undefined } })} /></Form.Item></Col>
    <Col xs={24} lg={6}><Form.Item label="Phường / xã (cũ)" name={addressField("OldWardId")} rules={!after ? [{ required: true }] : undefined}><WardSelect parentVal={oldDistrict?.toString()} /></Form.Item></Col>
    <Col xs={24} lg={6}><Form.Item label="Tên đường (cũ)" name={addressField("OldStreetId")} rules={!after ? [{ required: true }] : undefined}><StreetSelect parentVal={oldDistrict?.toString()} /></Form.Item></Col>
    <Col xs={24} lg={6}><Form.Item label="Số nhà (cũ)" name={addressField("OldAddressNumber")} rules={!after && !isLand ? [{ required: true }] : undefined}><Input /></Form.Item></Col>
  </>;

  return <div data-testid="property-address-entry">
    <Form.Item hidden name={addressField("DistrictId")}><Input /></Form.Item>
    <Space className="mb-4"><Switch checked={after} onChange={setAfter} aria-label="Nhập từ địa chỉ sau sáp nhập" /><Typography.Text>Nhập từ địa chỉ sau sáp nhập</Typography.Text></Space>
    <Row gutter={12}>
      <Col xs={24} lg={after ? 8 : 6}><Form.Item label="Tỉnh / thành phố" name={addressField("ProvinceId")} rules={[{ required: true }]} initialValue={1}><ProvinceSelect allowClear={false} onChange={() => form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), DistrictId: undefined, WardId: undefined, StreetId: undefined, OldDistrictId: undefined, OldWardId: undefined, OldStreetId: undefined } })} /></Form.Item></Col>
      {!after && oldFields}
    </Row>
    {!after && <Typography.Text type="secondary">Sau sáp nhập</Typography.Text>}
    <Row gutter={12}>
      <Col xs={24} lg={8}><Form.Item label="Phường / xã" name={addressField("WardId")} rules={[{ required: true }]}><WardSelect isNew parentVal={province?.toString()} /></Form.Item></Col>
      <Col xs={24} lg={8}><Form.Item label="Tên đường" name={addressField("StreetId")} rules={[{ required: true }]}><StreetSelect isNew parentVal={province?.toString()} /></Form.Item></Col>
      {isLand ? <><Col xs={24} lg={6}><Form.Item label="Thửa đất" name={addressField("LandNumber")} rules={[{ required: true }]}><Input /></Form.Item></Col><Col xs={24} lg={6}><Form.Item label="Tờ bản đồ" name={addressField("MapNumber")} rules={[{ required: true }]}><Input /></Form.Item></Col></> : <Col xs={24} lg={12}><Space.Compact block><Form.Item label="Số nhà" name={addressField("AddressNumber")} rules={[{ required: true }]} style={{ width: "70%" }}><Input onChange={(event) => { if (after) form.setFieldValue(addressField("OldAddressNumber"), event.target.value); }} /></Form.Item><Form.Item label="Chi tiết" name={addressField("SubAddress")} style={{ width: "30%" }}><SubAddressSelect /></Form.Item></Space.Compact></Col>}
    </Row>
    <Form.Item label="Tên đường thứ hai" htmlFor="property-second-street" extra="Lưu trong Ghi chú nội bộ.">
      <Input id="property-second-street" value={streetLine.exec(note)?.[1] ?? ""} onChange={(event) => {
        const current: string = form.getFieldValue("Note") ?? "";
        const name = event.target.value;
        const line = `Tên đường thứ hai: ${name}`;
        if (streetLine.test(current)) {
          form.setFieldValue("Note", name ? current.replace(streetLine, () => line) : current.replace(/(?:\r?\n)?^Tên đường thứ hai: [^\r\n]*$/m, ""));
        } else if (name) {
          form.setFieldValue("Note", current ? `${current}\n${line}` : line);
        }
      }} />
    </Form.Item>
    {notice && <Alert className="mb-3" type={candidates.length ? "warning" : "info"} message={notice} showIcon />}
    {candidates.length > 0 && <Select className="mb-3 w-full" placeholder={after ? "Chọn phường / xã cũ" : "Chọn phường / xã sau sáp nhập"} options={candidates.map((item) => ({ value: item.WardId, label: `${item.WardName}, ${item.DistrictName}${item.Description ? ` — ${item.Description}` : ""}` }))} onChange={(value) => {
      const chosen = candidates.find((item) => item.WardId === value);
      if (!chosen) return;
      form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), [after ? "OldWardId" : "WardId"]: chosen.WardId, [after ? "OldDistrictId" : "DistrictId"]: chosen.DistrictId } });
      setCandidates([]); setNotice("");
    }} />}
    {after && <div hidden={!showOld} className="mb-4 rounded-lg bg-gray-50 p-3"><div className="mb-3 flex justify-between"><Typography.Text strong>Địa chỉ cũ</Typography.Text><Button type="link" onClick={() => setShowOld(false)}>Thu gọn</Button></div><Row gutter={12}>{oldFields}</Row></div>}
    {after && !showOld && <Button className="mb-4" onClick={() => setShowOld(true)}>+ Thêm địa chỉ cũ</Button>}
    <Row gutter={12}><Col xs={24} lg={8}><Form.Item label="Hướng" name={addressField("Direction")}><DirectionSelect /></Form.Item></Col></Row>
    <PropertyCheckAddress form={form} model={model} transType={model?.TransType ?? transType} />
  </div>;
};

export default PropAddressInfo;
