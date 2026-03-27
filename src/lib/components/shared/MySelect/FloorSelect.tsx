import { Button, Divider, InputNumber, Select, Space } from 'antd';
import { useRef, useState } from 'react';

type Props = {
  value?: number | null;
  onChange?: (val: number) => void;
};

export const FloorSelect = ({ value, onChange }: Props) => {
  const [items, setItems] = useState(
    Array.from({ length: 11 }, (_, index) => index)
  );
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

  // useEffect(() => {
  //   if (value && !items.includes(value)) {
  //     setItems([...items, value]);
  //   }
  // }, [items, value]);

  return (
    <Select
      showSearch
      placeholder="Chọn"
      // eslint-disable-next-line react/no-unstable-nested-components
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <InputNumber
              ref={inputRef}
              value={name}
              onChange={(val) => val && setName(val)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button type="text" onClick={addItem} size="small">
              Thêm
            </Button>
          </Space>
        </>
      )}
      value={value}
      onChange={onChange}
      options={items.map((item, idx) => ({
        label: idx === 0 ? 'Trệt' : item.toString(),
        value: item.toString(),
      }))}
    />
  );
};
