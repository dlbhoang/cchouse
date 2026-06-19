"use client";
import { Button, Card, Col, Form, Input, Modal, Row, Space } from "antd";
import { useEffect, useState } from "react";

import RoleForm from "@/lib/components/admin/role/form";
import PermissionConfigs from "@/lib/components/admin/role/permission";
import RoleTabs from "@/lib/components/admin/role/tabInfo";
import BtnConfirm from "@/lib/components/shared/BtnConfirm";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import type { IRoleRequest, IRoleResponse } from "@/lib/interfaces/IRole";
import roleApi from "@/services/api/roleApi";

const { Search } = Input;

const RolePage = () => {
  const [formUpdate] = Form.useForm();
  const [formCreate] = Form.useForm();
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<IRoleResponse>();
  const [searchOptions, setSearchOptions] = useState<ISearchOptions>({
    pageIndex: 1,
    pageSize: 1000,
  } as ISearchOptions);

  const { data, isLoading, mutate } = roleApi.useGet(searchOptions);

  useEffect(() => {
    if (data !== undefined) {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions]);

  useEffect(() => {
    if (data !== undefined) setSelectedRole(data[0]);
  }, [data]);
  useEffect(() => {
    formUpdate.setFieldsValue(selectedRole);
  }, [selectedRole, formUpdate]);

  const handleSaveRole = async (val: IRoleRequest) => {
    const result = await roleApi.update(val);
    mutate();
    NotiBase("success", result.message ?? "Cập nhật thành công");
  };

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAdd = async (item: IRoleRequest) => {
    console.log("Success:", item);
    try {
      setConfirmLoading(true);
      const result = await roleApi.add(item);
      NotiBase("success", result.message ?? "Thêm thành công");
      setOpenCreateModal(false);
    } finally {
      mutate();
      setConfirmLoading(false);
    }
  };

  const handleDelete = async (item: IRoleRequest) => {
    const result = await roleApi.delete(item.Id);
    NotiBase("success", result.message ?? "Xóa thành công");
    mutate();
  };

  return (
    <>
      <Card>
        <Row gutter={12}>
          <Col span={24}>
            <Search
              placeholder="Tìm mã, tên"
              allowClear
              onSearch={(val: string) => {
                setSearchOptions({
                  ...searchOptions,
                  search: val,
                  pageIndex: 1,
                  pageSize: 1000,
                });
              }}
              style={{ width: 250, paddingBlock: 10 }}
            />
            <TitlePage title={AppRoutes.role.name} />
            {!isLoading && (
              <RoleTabs data={data ?? []} onChange={setSelectedRole} />
            )}
          </Col>
          <Col span={24}>
            <RoleForm
              model={selectedRole}
              form={formUpdate}
              onSubmit={handleSaveRole}
            />
          </Col>
          {selectedRole && (
            <Col span={24}>
              <PermissionConfigs role={selectedRole} form={formUpdate} />
            </Col>
          )}

          {selectedRole && (
            <Col style={{ padding: 10 }}>
              <Space>
                <Button type="primary" onClick={() => formUpdate.submit()}>
                  Lưu
                </Button>
                <BtnConfirm
                  type="text"
                  btnText="Xoá"
                  danger
                  onOkClick={() => handleDelete(selectedRole)}
                />
              </Space>
            </Col>
          )}
        </Row>
      </Card>

      <Modal
        title="Thêm chức vụ"
        maskClosable={false}
        open={openCreateModal}
        confirmLoading={confirmLoading}
        width={800}
        onCancel={() => {
          formCreate.resetFields();
          setOpenCreateModal(false);
        }}
        onOk={() => formCreate.submit()}
        okText="Lưu"
        cancelText="Đóng"
      >
        <RoleForm form={formCreate} onSubmit={handleAdd} />
      </Modal>
      <FloatBtn onClick={() => setOpenCreateModal(true)} />
    </>
  );
};

export default RolePage;
