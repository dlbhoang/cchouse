import { AutoComplete as LucideAutoComplete } from "@/lib/components/antd-lucide";
import { AutoCompleteProps } from 'antd';

const options = Array.from({ length: 11 }, (_, index) => ({
  value: index === 0 ? 'trệt' : index.toString(),
}));
const FloorAutoComplete = (props: AutoCompleteProps) => (
  <LucideAutoComplete
    {...props}
    options={options}
    placeholder="Nhập số lầu"
    filterOption={(inputValue, option) => {
      if (option?.value) {
        return (
          option.value
            ?.toString()
            .toUpperCase()
            .indexOf(inputValue.toUpperCase()) !== -1
        );
      }

      return true;
    }}
  />
);

export default FloorAutoComplete;
