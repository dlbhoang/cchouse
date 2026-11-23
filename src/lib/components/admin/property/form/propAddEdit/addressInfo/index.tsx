import { Alert, AutoComplete, Button, Col, Form, type FormInstance, Input, Row, Select, Space, Switch, Typography } from "antd";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DirectionSelect, DistrictSelect, ProvinceSelect, StreetSelect, WardSelect } from "@/lib/components/shared/MySelect";
import { SubAddressSelect } from "@/lib/components/shared/MySelect/Property/SubAddressSelect";
import type { IPropRequest, IPropResponse } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import mergeWardApi from "@/services/api/mergeWardApi";
import streetApi from "@/services/api/streetApi";
import wardApi from "@/services/api/wardApi";
import PropertyCheckAddress from "../../../modal/checkAddress";
import "./address-info.css";

type Props = { form: FormInstance<IPropRequest>; model?: IPropResponse; isFull: boolean };
type Candidate = { WardId: number; WardName: string; DistrictId: number; DistrictName: string; Description?: string };
const addressField = <K extends keyof IPropRequest["PropAddress"]>(name: K): ["PropAddress", K] => ["PropAddress", name];

const PropAddressInfo = ({ form, model }: Props) => {
  const { propType } = useAdminContext();
  const propTypeId = Form.useWatch(addressField("PropTypeId"), form);
  const isLand = propType.find((item) => item.Id === Number(propTypeId))?.Name?.toLowerCase().includes("đất");
  const [after, setAfter] = useState(Boolean(model?.Id && !model.PropAddress?.OldWardId));
  const [showOld, setShowOld] = useState(Boolean(model?.PropAddress?.OldWardId));
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [notice, setNotice] = useState("");
  const [showSecondStreet, setShowSecondStreet] = useState(false);
  const [secondStreetOptions, setSecondStreetOptions] = useState<Array<{ value: string; label: string; id: number }>>([]);
  const oldRequestId = useRef(0);
  const newRequestId = useRef(0);
  const province = Form.useWatch(addressField("ProvinceId"), form);
  const oldDistrict = Form.useWatch(addressField("OldDistrictId"), form);
  const ward = Form.useWatch(addressField("WardId"), form);
  const street = Form.useWatch(addressField("StreetId"), form);
  const oldWard = Form.useWatch(addressField("OldWardId"), form);
  const oldStreet = Form.useWatch(addressField("OldStreetId"), form);
  const oldNumber = Form.useWatch(addressField("OldAddressNumber"), form);
  const secondStreetName = Form.useWatch(addressField("SecondStreetName"), form) ?? "";
  const secondNumber = Form.useWatch(addressField("SecondAddressNumber"), form) ?? "";
  const transType = Form.useWatch("TransType", form);
  const converted = !after && !isLand && Boolean(ward && street && oldNumber) && candidates.length === 0 && !notice.startsWith("Không") && !notice.startsWith("Đã đổi");

  useEffect(() => {
    if (model?.Id) {
      setShowOld(Boolean(model.PropAddress?.OldWardId));
      setAfter(!model.PropAddress?.OldWardId);
      setShowSecondStreet(Boolean(model.PropAddress?.SecondStreetName));
    }
  }, [model?.Id, model?.PropAddress?.OldWardId]);

  useEffect(() => {
    if ((!showSecondStreet && !secondStreetName) || !province) return;
    let active = true;
    streetApi.get({
      ...(oldDistrict ? { DistrictId: String(oldDistrict), IsNew: false } : { ProvinceId: String(province), IsNew: true }),
      pageIndex: 1,
      pageSize: 10000,
    }).then((result) => {
      if (active) setSecondStreetOptions((result.data || []).map((street) => ({ value: street.Name, label: street.Name, id: street.Id })));
    }).catch(() => { if (active) setSecondStreetOptions([]); });
    return () => { active = false; };
  }, [showSecondStreet, Boolean(secondStreetName), oldDistrict, province]);

  const updateSecondStreet = (name: string, number: string) => {
    form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), SecondStreetName: name, SecondAddressNumber: number } });
  };

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
        setCandidates(converted.IsAmbiguous ? converted.Candidates || [] : []);
        if (oldNumber) form.setFieldValue(addressField("AddressNumber"), oldNumber);
        if (converted.IsAmbiguous) {
          form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), DistrictId: undefined, WardId: undefined, StreetId: undefined } });
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
        if (id === oldRequestId.current) {
          setCandidates([]);
          form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), DistrictId: undefined, WardId: undefined, StreetId: undefined } });
          setNotice("Không thể chuyển đổi địa chỉ này. Kiểm tra lại địa chỉ cũ.");
        }
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
        const previous = choices.find((item) => item.WardId === Number(form.getFieldValue(addressField("OldWardId"))));
        setCandidates(choices.length > 1 && !previous ? choices : []);
        if (previous) {
          form.setFieldValue(addressField("OldDistrictId"), previous.DistrictId);
          setNotice(`Trước sáp nhập: ${previous.WardName}, ${previous.DistrictName}`);
        } else if (choices.length === 1) {
          form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), OldDistrictId: choices[0].DistrictId, OldWardId: choices[0].WardId } });
          setNotice(`Trước sáp nhập: ${choices[0].WardName}, ${choices[0].DistrictName}`);
        } else if (choices.length > 1) {
          form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), OldDistrictId: undefined, OldWardId: undefined } });
          setNotice("Có nhiều địa chỉ cũ tương ứng. Chọn phường cũ đúng trước khi lưu.");
        } else {
          form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), OldDistrictId: undefined, OldWardId: undefined } });
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
    <Col xs={24} lg={6}><Form.Item label="Phường / xã (cũ)" name={addressField("OldWardId")} rules={!after ? [{ required: true }] : undefined}><WardSelect parentVal={oldDistrict?.toString()} onChange={(value) => { if (!value) form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), DistrictId: undefined, WardId: undefined, StreetId: undefined } }); }} /></Form.Item></Col>
    <Col xs={24} lg={6}><Form.Item label="Tên đường (cũ)" name={addressField("OldStreetId")} rules={!after ? [{ required: true }] : undefined}><StreetSelect parentVal={oldDistrict?.toString()} /></Form.Item></Col>
    <Col xs={24} lg={6}><Form.Item label="Số nhà (cũ)" name={addressField("OldAddressNumber")} rules={!after && !isLand ? [{ required: true }] : undefined}><Input /></Form.Item></Col>
  </>;

  const currentFields = <>
      <Col xs={24} lg={8}><Form.Item label="Phường / xã" name={addressField("WardId")} rules={[{ required: true }]}><WardSelect isNew parentVal={province?.toString()} /></Form.Item></Col>
      <Col xs={24} lg={8}><Form.Item label="Tên đường" name={addressField("StreetId")} rules={[{ required: true }]}><StreetSelect isNew parentVal={province?.toString()} /></Form.Item></Col>
      {isLand ? <><Col xs={24} lg={6}><Form.Item label="Thửa đất" name={addressField("LandNumber")} rules={[{ required: true }]}><Input /></Form.Item></Col><Col xs={24} lg={6}><Form.Item label="Tờ bản đồ" name={addressField("MapNumber")} rules={[{ required: true }]}><Input /></Form.Item></Col></> : <Col xs={24} lg={12}><Space.Compact block><Form.Item label="Số nhà" name={addressField("AddressNumber")} rules={[{ required: true }]} style={{ width: "70%" }}><Input onChange={(event) => { if (after && !form.getFieldValue(addressField("OldAddressNumber"))) form.setFieldValue(addressField("OldAddressNumber"), event.target.value); }} /></Form.Item><Form.Item label="Chi tiết" name={addressField("SubAddress")} style={{ width: "30%" }}><SubAddressSelect /></Form.Item></Space.Compact></Col>}
  </>;

  return <div data-testid="property-address-entry" className="property-address-entry">
    <Form.Item hidden name={addressField("SecondStreetName")}><Input /></Form.Item>
    <Form.Item hidden name={addressField("SecondAddressNumber")}><Input /></Form.Item>
    <Form.Item hidden name={addressField("DistrictId")} rules={[{ required: true, message: "Không xác định được quận / huyện cho phường này." }]}><Input /></Form.Item>
    <Space className="mb-4"><Switch checked={after} onChange={setAfter} aria-label="Nhập từ địa chỉ sau sáp nhập" /><Typography.Text>Nhập từ địa chỉ sau sáp nhập</Typography.Text></Space>
    <Row gutter={12} className={after ? "address-primary address-primary-after" : "address-primary"}>
      <Col xs={24} lg={after ? 8 : 6}><Form.Item label="Tỉnh / thành phố" name={addressField("ProvinceId")} rules={[{ required: true }]} initialValue={1}><ProvinceSelect allowClear={false} onChange={() => form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), DistrictId: undefined, WardId: undefined, StreetId: undefined, OldDistrictId: undefined, OldWardId: undefined, OldStreetId: undefined } })} /></Form.Item></Col>
      {!after && oldFields}
      {after && currentFields}
    </Row>
    {!after && (converted ? <>
      <Form.Item hidden name={addressField("WardId")}><Input /></Form.Item>
      <Form.Item hidden name={addressField("StreetId")}><Input /></Form.Item>
      <Form.Item hidden name={addressField("AddressNumber")}><Input /></Form.Item>
      <Typography.Text className="address-conversion-summary">Sau sáp nhập: {notice || "Địa chỉ đã được chuyển đổi"}</Typography.Text>
    </> : <><Typography.Text type="secondary">Sau sáp nhập</Typography.Text><Row gutter={12} className="address-converted">{currentFields}</Row></>)}
    {(showSecondStreet || secondStreetName) && <Row gutter={12} className="address-second">
      <Col xs={24} lg={6}><Form.Item label="Tỉnh / thành phố"><ProvinceSelect value={province} disabled /></Form.Item></Col>
      <Col xs={24} lg={6}><Form.Item label="Quận / huyện"><DistrictSelect parentVal={province?.toString()} value={oldDistrict} disabled /></Form.Item></Col>
      <Col xs={24} lg={6}><Form.Item label="Phường / xã"><WardSelect parentVal={oldDistrict?.toString()} value={oldWard} disabled /></Form.Item></Col>
      <Col xs={24} lg={6}><Form.Item label="Tên đường thứ hai" htmlFor="property-second-street"><AutoComplete id="property-second-street" value={secondStreetName} options={secondStreetOptions} onChange={(value) => updateSecondStreet(value, secondNumber)} /></Form.Item></Col>
      <Col xs={24} lg={6}><Form.Item label="Số nhà thứ hai" htmlFor="property-second-number"><Input id="property-second-number" value={secondNumber} onChange={(event) => updateSecondStreet(secondStreetName, event.target.value)} /></Form.Item></Col>
      <Col xs={24}><Button icon={<X size={16} />} title="Bỏ địa chỉ thứ hai" aria-label="Bỏ địa chỉ thứ hai" onClick={() => { updateSecondStreet("", ""); setShowSecondStreet(false); }} /></Col>
    </Row>}
    {!showSecondStreet && !secondStreetName && <Button className="mb-4" icon={<Plus size={16} />} onClick={() => setShowSecondStreet(true)}>Thêm tên đường</Button>}
    {notice && !converted && <Alert className="mb-3" type={candidates.length ? "warning" : "info"} message={notice} showIcon />}
    {candidates.length > 0 && <Select aria-label={after ? "Chọn phường / xã cũ" : "Chọn phường / xã sau sáp nhập"} className="mb-3 w-full" placeholder={after ? "Chọn phường / xã cũ" : "Chọn phường / xã sau sáp nhập"} options={candidates.map((item) => ({ value: item.WardId, label: `${item.WardName}, ${item.DistrictName}${item.Description ? ` — ${item.Description}` : ""}` }))} onChange={(value) => {
      const chosen = candidates.find((item) => item.WardId === value);
      if (!chosen) return;
      form.setFieldsValue({ PropAddress: { ...form.getFieldValue("PropAddress"), [after ? "OldWardId" : "WardId"]: chosen.WardId, [after ? "OldDistrictId" : "DistrictId"]: chosen.DistrictId } });
      setCandidates([]); setNotice("");
    }} />}
    {after && <div hidden={!showOld} className="mb-4 rounded-lg bg-gray-50 p-3"><div className="mb-3 flex justify-between"><Typography.Text strong>Địa chỉ cũ</Typography.Text><Button type="link" onClick={() => setShowOld(false)}>Thu gọn</Button></div><Row gutter={12} className="address-old">{oldFields}</Row></div>}
    {after && !showOld && <Button className="mb-4" onClick={() => setShowOld(true)}>+ Thêm địa chỉ cũ</Button>}
    <Row gutter={12}><Col xs={24} lg={8}><Form.Item label="Hướng" name={addressField("Direction")}><DirectionSelect /></Form.Item></Col></Row>
    <PropertyCheckAddress form={form} model={model} transType={model?.TransType ?? transType} />
  </div>;
};

export default PropAddressInfo;
