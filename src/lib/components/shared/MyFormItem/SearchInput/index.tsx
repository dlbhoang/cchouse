import { Button, Form, FormInstance, Input, Space, Tooltip } from 'antd';
import { RotateCcwIcon, SearchIcon } from 'lucide-react';

const { Search } = Input;
type Props = {
  form: FormInstance;
  placeholder: string;
  handleRefresh: () => void;
  hideRefresh?: boolean;
};
export const SearchInput = ({ form, placeholder, handleRefresh, hideRefresh = false }: Props) => {
  return (
    <Form.Item name="Search">
      <Space.Compact direction="horizontal" style={{ width: '100%' }}>
        <Search
          placeholder={placeholder}
          onSearch={() => {
            form.submit();
          }}
          enterButton={
            <Button
              type="primary"
              style={{ backgroundColor: '#0788f5', borderColor: '#0788f5' }}
              icon={<SearchIcon className="size-4" />}
            />
          }
        />
        {!hideRefresh && (
          <Tooltip title="Đặt lại">
            <Button
              type="default"
              style={{ color: '#0788f5', borderColor: '#0788f5' }}
              icon={<RotateCcwIcon className="size-4" />}
              onClick={handleRefresh}
            />
          </Tooltip>
        )}
      </Space.Compact>
    </Form.Item>
  );
};
