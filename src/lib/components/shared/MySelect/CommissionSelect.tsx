import { InputNumber as LucideInputNumber } from "@/lib/components/antd-lucide";
import { Select as LucideSelect } from "@/lib/components/antd-lucide";
import {Plus } from "lucide-react";

import { Button, Divider, Space} from 'antd';
import { useRef, useState } from 'react';

type Props = {
  value?: number | null;
  onChange?: (val: number) => void;
};

const CommissionSelect = ({ value, onChange }: Props) => {
  const [items, setItems] = useState([0, 40, 45, 50, 55, 58, 60, 61, 64, 65]);
  const [name, setName] = useState<number>();
  const inputRef = useRef(null);

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    if (name && !items.includes(name)) {
      setItems([...items, name]);
      if (onChange) onChange(name);
    }
    setName(undefined);
    // setTimeout(() => {
    //   inputRef.current?.focus();
    // }, 0);
  };

  return (
    <LucideSelect
      placeholder="Chọn"
      // eslint-disable-next-line react/no-unstable-nested-components
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <LucideInputNumber
              ref={inputRef}
              value={name}
              onChange={(val) => val && setName(val)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button type="text" icon={<Plus size={16} />} onClick={addItem}>
              Thêm lựa chọn
            </Button>
          </Space>
        </>
      )}
      value={value}
      onChange={onChange}
      options={items.map((item) => ({ label: `${item}%`, value: item }))}
    />
  );
};

export default CommissionSelect;
