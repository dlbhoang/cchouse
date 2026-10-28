import { Mic } from "lucide-react";

import { Input } from 'antd';
import { SearchProps } from 'antd/es/input';

const { Search } = Input;
type Props = {
  name: string;
  label: string;
} & SearchProps;
export const AudioInput = ({
  name,
  label,
  placeholder,
  onSearch,
  ...props
}: Props) => {
  return (
    <Search
      placeholder={placeholder}
      enterButton="Search"
      suffix={
        <Mic size={16}
          style={{
            fontSize: 16,
            color: '#1677ff',
          }}
        />
      }
      onSearch={onSearch}
      {...props}
    />
  );
};
