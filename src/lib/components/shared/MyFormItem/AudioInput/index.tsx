import { AudioOutlined } from '@ant-design/icons';
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
        <AudioOutlined
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
