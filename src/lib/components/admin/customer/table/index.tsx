import { Button, Col, Drawer, Form, Row, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import FloatBtn from "@/lib/components/shared/FloatBtn";
import TableBase from "@/lib/components/shared/TableBase";
import { ETransType } from "@/lib/core/enum";
import { ICustomerOpts } from "@/lib/interfaces/filter/ISearchOptions";
import AddEditCustomer from "@/lib/pages/customer/addEdit";
import { useAdminContext } from "@/lib/stored";
import customerApi from "@/services/api/customer/customerApi";
import {
  ICustomerRequest,
  ICustomerResponse,
} from "@/services/api/customer/ICustomer";
import RecProps from "../recProps";

import columns from "./columns";

type Props = {
  searchOptions: ICustomerOpts;
  onPageIndexChange: (pageIndex: number, pageSize: number) => void;
};
export const CustomerTable = ({ searchOptions, onPageIndexChange }: Props) => {
  const { smallScreen } = useAdminContext();
  const { data, isValidating, mutate } = customerApi.useGet(searchOptions);
  const [form] = Form.useForm<ICustomerRequest>();

  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [dataTransType, setDataTransType] = useState<ETransType>(
    ETransType.sell
  );
  const [selectedData, setSeletedData] = useState<ICustomerResponse>();

  const handleCancel = () => {
    setOpen(false);
    setSelect(0);
  };

  const showModalAddEditCustomer = () => {
    setOpen(true);
  };

  useEffect(() => {
    mutate();
  }, [mutate, searchOptions]);

  const cols = useMemo(() => {
    return columns({
      reqType:
        Number(searchOptions.TransType) === ETransType.sell
          ? "BuyingRequirement"
          : "RentingRequirement",
      handlSelect: (id) => {
        setSelect(id);
        setOpen(true);
      },
      openRecommend: (item: ICustomerResponse, transType: ETransType) => {
        setOpenModal(true);
        setSeletedData(item);
        setDataTransType(transType);
      },
    });
  }, [searchOptions.TransType]);

  return (
    <Row gutter={12}>
      <Col xs={24}>
        <TableBase
          loading={isValidating}
          cols={cols}
          data={data?.data ?? []}
          total={data?.totalRow ?? 0}
          searchOptions={searchOptions}
          bordered
          onPageIndexChange={onPageIndexChange}
        />
      </Col>

      <Drawer
        title={
          <Typography.Text strong>
            {select > 0
              ? "Chỉnh sửa".toUpperCase()
              : "Thêm khách hàng".toUpperCase()}
          </Typography.Text>
        }
        onClose={handleCancel}
        open={open}
        placement={smallScreen ? "bottom" : "right"}
        height="100%"
        width={600}
        extra={
          <Button
            type="primary"
            onClick={() => {
              form.submit();
            }}
          >
            {select > 0 ? "Lưu" : "Thêm"}
          </Button>
        }
      >
        <AddEditCustomer
          form={form}
          id={select}
          handleClose={() => setOpen(false)}
        />
      </Drawer>
      <FloatBtn
        onClick={() => {
          form.resetFields();
          setSelect(0);
          showModalAddEditCustomer();
        }}
      />
      {selectedData && (
        <RecProps
          isModalOpen={openModal}
          handleCancel={() => setOpenModal(false)}
          model={selectedData}
          transType={dataTransType}
        />
      )}
    </Row>
  );
};
