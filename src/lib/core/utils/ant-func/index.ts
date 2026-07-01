import { FormInstance } from "antd";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";

export function globalHandleFailed(form: FormInstance) {
  return ({ errorFields }: ValidateErrorEntity) => {
    console.log("errorInfo", errorFields);

    const firstField = errorFields?.[0];

    if (!firstField?.name?.length) return;

    form.scrollToField(firstField.name, {
      block: "center",
      behavior: "smooth",
    });
  };
}

const calculateAreaValue = (width: number, length: number) =>
  Math.round(width * length * 100) / 100;

const getDimensions = (values: any, key?: string) =>
  key
    ? {
        width: values?.[key]?.Width,
        length: values?.[key]?.Length,
      }
    : {
        width: values?.Width,
        length: values?.Length,
      };

export const calculateArea = (
  form: FormInstance,
  allValues: any,
  key?: string
) => {
  const { width, length } = getDimensions(allValues, key);

  if (!width || !length) return;

  const area = calculateAreaValue(width, length);

  if (key) {
    form.setFieldValue([key, "Area"], area);
  } else {
    form.setFieldValue("Area", area);
  }
};