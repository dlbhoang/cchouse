"use client";
import { Card, Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";

import BranchForm from "@/lib/components/admin/branch/form";
import { BranchTable } from "@/lib/components/admin/branch/table";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import { AppRoutes } from "@/lib/core/configs/appRoutes";
import TitlePage from "@/lib/core/layout/components/TitlePage";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import branchApi from "@/services/api/branch/branchApi";
import type { IBranchRequest } from "@/services/api/branch/IBranch";

const { Search } = Input;
const BranchPage = () => {
  const [form] = Form.useForm<IBranchRequest>();
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [selectedData, setSeletedData] = useState<IBranchRequest>();
  const [searchOptions, setSearchOptions] = useState<ISearchOptions>({
    pageIndex: 1,
    pageSize: 1000,
  } as ISearchOptions);

  const { data, mutate } = branchApi.useGet(searchOptions);

  useEffect(() => {
    form.setFieldsValue({ ...selectedData });
  }, [form, selectedData]);

  useEffect(() => {
    if (data !== undefined) {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleSubmit = async (item: IBranchRequest) => {
    console.log("Success:", item);
    try {
      setConfirmLoading(true);
      if (item.Id) {
        await branchApi.update(item);
      } else {
        await branchApi.add(item);
      }
      setOpenCreateModal(false);
    } finally {
      mutate();
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Search
              placeholder="Tìm mã, tên"
              allowClear
              onSearch={(val: string) => {
                setSearchOptions({
                  ...searchOptions,
                  search: val,
                  pageIndex: 1,
                });
              }}
              style={{ width: 250 }}
            />
          </Col>
          <Col span={24}>
            <TitlePage title={AppRoutes.branch.name} />
            <BranchTable
              onEdit={(item) => {
                setSeletedData(item);
                setOpenCreateModal(true);
              }}
              onPageIndexChange={() => {}}
              searchOptions={searchOptions}
            />
          </Col>
        </Row>
      </Card>

      <Modal
        title={selectedData ? "Cập nhật chi nhánh" : "Thêm chi nhánh"}
        maskClosable={false}
        open={openCreateModal}
        confirmLoading={confirmLoading}
        width={800}
        onCancel={() => {
          form.resetFields();
          setOpenCreateModal(false);
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Đóng"
      >
        <BranchForm form={form} onSubmit={handleSubmit} />
      </Modal>
      <FloatBtn onClick={() => setOpenCreateModal(true)} />
    </>
  );
};

export default BranchPage;
