import { Form, Input, Menu, Space } from 'antd';
import { useState } from 'react';

const areaData = [
  {
    text: `Dưới 100`,
    areaFrom: 0,
    areaTo: 10,
  },
  {
    text: 'Từ 100 - 200',
    areaFrom: 10,
    areaTo: 20,
  },
  {
    text: 'Từ 200 - 300',
    areaFrom: 20,
    areaTo: 30,
  },
  {
    text: 'Từ 300- 400',
    areaFrom: 30,
    areaTo: 40,
  },
];
type Area = {
  text: string;
  areaFrom: number;
  areaTo: number;
};
type Props = {
  labelAreaFrm?: string | undefined;
  labelAreaTo?: string | undefined;
  nameAreaFrm: string;
  nameAreaTo: string;
};
export const AreaSelect = ({
  labelAreaFrm,
  labelAreaTo,
  nameAreaFrm,
  nameAreaTo,
}: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const handaleSelectItem = (item: Area) => {
    setFromValue(item.areaFrom.toString());
    setToValue(item.areaTo.toString());
    toggleMenu();
  };
  const generateMenu = () => {
    if (menuVisible) {
      return (
        <Menu style={{ position: 'absolute', zIndex: '100', width: '100%' }}>
          {areaData.map((item: Area) => (
            <Menu.Item key={item.text} onClick={() => handaleSelectItem(item)}>
              <>
                {item.text} m<sup>2</sup>
              </>
            </Menu.Item>
          ))}
        </Menu>
      );
    }
    return null;
  };
  return (
    <>
      <Space.Compact>
        <Form.Item name={nameAreaFrm} label={labelAreaFrm}>
          <Input
            allowClear
            onClick={toggleMenu}
            placeholder="Diện tích từ"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
          />
        </Form.Item>
        <Form.Item name={nameAreaTo} label={labelAreaTo}>
          <Input
            allowClear
            onClick={toggleMenu}
            placeholder="Diện tích đến"
            value={toValue}
            onChange={(e) => setToValue(e.target.value)}
          />
        </Form.Item>
      </Space.Compact>
      {generateMenu()}
    </>
  );
};
