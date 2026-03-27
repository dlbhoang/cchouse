"use client";
import { Form, type FormInstance } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import CustomerInfo from "@/lib/components/admin/customer/form/customerInfo";
import { globalHandleFailed } from "@/lib/core/utils/ant-func";
import customerApi from "@/services/api/customer/customerApi";
import type {
  ICustomerRequest,
  ICustomerResponse,
} from "@/services/api/customer/ICustomer";

type Props = {
  id: number;
  form: FormInstance<ICustomerRequest>;
  handleClose: () => void;
};

const AddEditCustomer = ({ id, form, handleClose }: Props) => {
  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [dataCustomerByID, setDataCustomerByID] = useState<ICustomerResponse>();

  useEffect(() => {
    const fetchData = async () => {
      if (id > 0) {
        const result = await customerApi.getById(id);
        if (!result.data) {
          router.push("/404");
        }
        setDataCustomerByID(result.data);
      }
    };
    fetchData();
  }, [id, router]);

  const onFinish = async (result: ICustomerRequest) => {
    console.log("Success:", result);
    try {
      setIsSubmit(true);

      if (result.Id > 0) await customerApi.update(result);
      else await customerApi.add(result);

      mutate(customerApi.mutateKey);
      handleClose();
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Form
      name="basic"
      disabled={isSubmit}
      onFinish={onFinish}
      onFinishFailed={globalHandleFailed(form)}
      autoComplete="off"
      form={form}
      layout="vertical"
    >
      <CustomerInfo form={form} model={dataCustomerByID} />
    </Form>
  );
};

export default AddEditCustomer;
