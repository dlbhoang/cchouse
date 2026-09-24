"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import type { IDistrictResponse, IWardResponse } from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import mergeWardApi, { IMergeWard } from "@/services/api/mergeWardApi";
import districtApi from "@/services/api/districtApi";
import wardApi from "@/services/api/wardApi";

type Values = {
  OldWardId?: number;
  NewWardId?: number;
  OldWardName?: string;
  OldDistrictId?: number;
  NewWardName?: string;
  NewDistrictId?: number;
};

export default function MergeWardTab() {
  const [rows, setRows] = useState<IMergeWard[]>([]);
  const [wards, setWards] = useState<IWardResponse[]>([]);
  const [districts, setDistricts] = useState<IDistrictResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<IMergeWard>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customOld, setCustomOld] = useState(false);
  const [customNew, setCustomNew] = useState(false);
  const [form] = Form.useForm<Values>();

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await mergeWardApi.get();
      setRows(response.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    void Promise.all([
      wardApi.get({ pageIndex: 1, pageSize: 10000 }),
      districtApi.get({ pageIndex: 1, pageSize: 10000 }),
    ]).then(([wardResponse, districtResponse]) => {
      setWards(wardResponse.data ?? []);
      setDistricts(districtResponse.data ?? []);
    });
  }, []);

  const options = useMemo(() => {
    const districtById = new Map(districts.map((district) => [district.Id, district.Name]));
    return wards.map((ward) => {
      const districtName = districtById.get(ward.DistrictId);
      return {
        value: ward.Id,
        label: districtName ? `${ward.Name} (${districtName})` : ward.Name,
      };
    });
  }, [wards, districts]);
  const filteredRows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    if (!query) return rows;
    return rows.filter((row) => [row.OldWardName, row.OldDistrictName, row.NewWardName, row.NewDistrictName]
      .some((value) => value?.toLocaleLowerCase("vi").includes(query)));
  }, [rows, search]);
  const showAdd = () => { setEditing(undefined); setCustomOld(false); setCustomNew(false); form.resetFields(); setOpen(true); };
  const showEdit = (row: IMergeWard) => {
    setEditing(row);
    setCustomOld(false);
    setCustomNew(false);
    form.setFieldsValue({ OldWardId: row.OldWardId, NewWardId: row.NewWardId });
    setOpen(true);
  };
  const save = async (values: Values) => {
    setSaving(true);
    try {
      const resolveWardId = async (id: number | undefined, isCustom: boolean, name?: string, districtId?: number) => {
        if (!isCustom) {
          if (!id) throw new Error("Vui lòng chọn phường/xã");
          return id;
        }
        const cleanName = name?.trim();
        if (!cleanName || !districtId) throw new Error("Vui lòng nhập tên phường/xã và chọn quận/huyện");
        const created = await wardApi.add({ Id: 0, Name: cleanName, ShortName: cleanName, RefKey: "", Type: "", Images: "", DistrictId: districtId });
        return created.data;
      };

      const newWardId = await resolveWardId(values.NewWardId, customNew, values.NewWardName, values.NewDistrictId);
      if (editing) {
        await mergeWardApi.update(editing.Id, { NewWardId: newWardId, Description: "" });
      } else {
        const oldWardId = await resolveWardId(values.OldWardId, customOld, values.OldWardName, values.OldDistrictId);
        await mergeWardApi.add({ OldWardId: oldWardId, NewWardId: newWardId, Description: "" });
      }
      setOpen(false);
      const updatedWards = await wardApi.get({ pageIndex: 1, pageSize: 10000 });
      setWards(updatedWards.data ?? []);
      await refresh();
    } finally { setSaving(false); }
  };

  const columns: ColumnsType<IMergeWard> = [
    { title: "Địa chỉ cũ", render: (_, row) => <Space direction="vertical" size={2}><Typography.Text strong>{row.OldWardName}</Typography.Text><Typography.Text type="secondary">{row.OldDistrictName}</Typography.Text></Space> },
    { title: "Phường/xã mới", render: (_, row) => <Space direction="vertical" size={2}><Tag color="blue" bordered={false}>{row.NewWardName}</Tag><Typography.Text type="secondary">{row.NewDistrictName}</Typography.Text></Space> },
    { title: "Thao tác", width: 112, render: (_, row) => <Space>
      <Button className="address-row-action address-row-edit" aria-label="Sửa ánh xạ" icon={<EditOutlined />} onClick={() => showEdit(row)} />
      <Popconfirm title="Xóa ánh xạ địa chỉ này?" onConfirm={async () => { await mergeWardApi.delete(row.Id); await refresh(); }}>
        <Button className="address-row-action address-row-delete" aria-label="Xóa ánh xạ" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </Space> },
  ];

  return <div className="address-conversion">
    <div className="address-conversion-toolbar">
      <Input allowClear prefix={<SearchOutlined />} placeholder="Tìm địa chỉ cũ hoặc địa chỉ chuyển đổi" value={search} onChange={(event) => setSearch(event.target.value)} />
      <Button type="primary" icon={<PlusOutlined />} onClick={showAdd}>Thêm mới</Button>
    </div>
    <div className="address-conversion-table">
      <Table rowKey="Id" columns={columns} dataSource={filteredRows} loading={loading} pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `${total} địa chỉ` }} />
    </div>
    <Modal title={editing ? "Sửa ánh xạ địa chỉ" : "Thêm chuyển đổi địa chỉ"} open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText={editing ? "Lưu thay đổi" : "Thêm chuyển đổi địa chỉ"} okButtonProps={{ className: "address-conversion-submit" }} confirmLoading={saving} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={save}>
        {!editing && <>
          {!customOld ? <Form.Item name="OldWardId" label="Phường/xã cũ" rules={[{ required: !customOld, message: "Vui lòng chọn phường/xã cũ" }]}>
            <Select showSearch optionFilterProp="label" options={options} placeholder="Chọn địa chỉ cũ" />
          </Form.Item> : <>
            <Form.Item name="OldWardName" label="Tên phường/xã cũ" rules={[{ required: true, whitespace: true, message: "Vui lòng nhập tên phường/xã cũ" }]}><Input placeholder="Nhập tên địa chỉ cũ" /></Form.Item>
            <Form.Item name="OldDistrictId" label="Quận/huyện của địa chỉ cũ" rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}>
              <Select showSearch optionFilterProp="label" options={districts.map((d) => ({ value: d.Id, label: `${d.Name} (${d.ProvinceName})` }))} placeholder="Chọn quận/huyện" />
            </Form.Item>
          </>}
          <Button type="link" className="address-conversion-inline-link" onClick={() => { setCustomOld(!customOld); form.setFieldsValue({ OldWardId: undefined, OldWardName: undefined, OldDistrictId: undefined }); }}>
            {customOld ? "Chọn từ danh sách có sẵn" : "Không tìm thấy phường/xã cũ? Nhập tên mới"}
          </Button>
        </>}
        {!customNew ? <Form.Item name="NewWardId" label="Phường/xã mới" rules={[{ required: !customNew, message: "Vui lòng chọn phường/xã mới" }]}>
          <Select showSearch optionFilterProp="label" options={options} placeholder="Chọn địa chỉ mới" />
        </Form.Item> : <>
          <Form.Item name="NewWardName" label="Tên phường/xã mới" rules={[{ required: true, whitespace: true, message: "Vui lòng nhập tên phường/xã mới" }]}><Input placeholder="Nhập tên địa chỉ mới" /></Form.Item>
          <Form.Item name="NewDistrictId" label="Quận/huyện của địa chỉ mới" rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}>
            <Select showSearch optionFilterProp="label" options={districts.map((d) => ({ value: d.Id, label: `${d.Name} (${d.ProvinceName})` }))} placeholder="Chọn quận/huyện" />
          </Form.Item>
        </>}
        <Button type="link" className="address-conversion-inline-link" onClick={() => { setCustomNew(!customNew); form.setFieldsValue({ NewWardId: undefined, NewWardName: undefined, NewDistrictId: undefined }); }}>
          {customNew ? "Chọn từ danh sách có sẵn" : "Không tìm thấy phường/xã mới? Nhập tên mới"}
        </Button>
      </Form>
    </Modal>
  </div>;
}
