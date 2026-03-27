import { Button, Form, FormInstance, Input, Space, Tooltip } from "antd";
import { RotateCcwIcon, SearchIcon } from "lucide-react";

const { Search } = Input;
type Props = {
  form: FormInstance;
  placeholder: string;
  handleRefresh: () => void;
};
export const SearchInput = ({ form, placeholder, handleRefresh }: Props) => {
  return (
    <Form.Item name="Search">
      <Space.Compact direction="horizontal" style={{ width: "100%" }}>
        <Search
          placeholder={placeholder}
          onSearch={() => {
            form.submit();
          }}
          enterButton={
            <Button
              style={{ backgroundColor: "orange" }}
              icon={<SearchIcon className="size-4" />}
            />
          }
        />
        <Tooltip title="Đặt lại">
          <Button
            type="primary"
            icon={<RotateCcwIcon className="size-4" />}
            onClick={handleRefresh}
          />
        </Tooltip>
      </Space.Compact>
    </Form.Item>
  );
};
