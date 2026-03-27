import { FormInstance } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

export function globalHandleFailed(form: FormInstance) {
  return (errorInfo: ValidateErrorEntity) => {
    console.log('errorInfo', errorInfo);
    form.scrollToField(errorInfo.errorFields[0].name, {
      block: 'center',
      behavior: 'smooth',
    });
  };
}

const calculateAreaValue = (width: number, length: number) =>
  Math.round(width * length * 100) / 100;

const getDimensions = (values: any, key?: string) => {
  return key
    ? { width: values[key]?.Width, length: values[key]?.Length }
    : { width: values?.Width, length: values?.Length };
};

export const calculateArea = (
  form: FormInstance<any>,
  allValues: any,
  key?: string
) => {
  const { width, length } = getDimensions(allValues, key);

  if (width && length) {
    const newValues = key
      ? {
          [key]: {
            ...allValues[key],
            Area: calculateAreaValue(width, length),
          },
        }
      : { Area: calculateAreaValue(width, length) };

    form.setFieldsValue({
      ...allValues,
      ...newValues,
    });
  }
};
