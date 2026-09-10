import { Checkbox, Form, FormInstance } from "antd";

const AUCTION_CUSTOMER_TYPE = 6;

type Props<T extends { CustomerType?: number }> = {
  form: FormInstance<T>;
};

/**
 * Checkbox "Đấu giá" điều khiển chung field CustomerType với CustomerTypeSelect.
 * Dùng Form.useWatch để luôn đồng bộ với select, không phụ thuộc prop `model`.
 */
export const AuctionCheckbox = <T extends { CustomerType?: number }>({
  form,
}: Props<T>) => {
  const customerType = Form.useWatch("CustomerType" as any, form);

  return (
    <Checkbox
      checked={Number(customerType) === AUCTION_CUSTOMER_TYPE}
      onChange={(e) => {
        form.setFieldValue(
          "CustomerType" as any,
          e.target.checked ? AUCTION_CUSTOMER_TYPE : undefined
        );
      }}
    >
      Đấu giá
    </Checkbox>
  );
};