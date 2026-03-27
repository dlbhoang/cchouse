import { Form, Input, Menu, Space } from 'antd';
import { useState } from 'react';

const priceData = [
  {
    text: 'Dưới 10 tỷ',
    priceFrom: 0,
    priceTo: 10,
  },
  {
    text: 'Từ 10 - 20 tỷ',
    priceFrom: 10,
    priceTo: 20,
  },
  {
    text: 'Từ 20 - 30 tỷ',
    priceFrom: 20,
    priceTo: 30,
  },
  {
    text: 'Từ 30 - 40 tỷ',
    priceFrom: 30,
    priceTo: 40,
  },
];
type Price = {
  text: string;
  priceFrom: number;
  priceTo: number;
};
type Props = {
  labelPriceFrm?: string | undefined;
  labelPriceTo?: string | undefined;
  namePriceFrm: string;
  namePriceTo: string;
};
export const PriceSelect = ({
  labelPriceFrm,
  labelPriceTo,
  namePriceFrm,
  namePriceTo,
}: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const handaleSelectItem = (item: Price) => {
    setFromValue(item.priceFrom.toString());
    setToValue(item.priceTo.toString());
    toggleMenu();
  };
  const generateMenu = () => {
    if (menuVisible) {
      return (
        <Menu style={{ position: 'absolute', zIndex: '100', width: '100%' }}>
          {priceData.map((item: Price) => (
            <Menu.Item key={item.text} onClick={() => handaleSelectItem(item)}>
              {item.text}
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
        <Form.Item name={namePriceFrm} label={labelPriceFrm}>
          <Input
            allowClear
            onClick={toggleMenu}
            placeholder="Giá từ"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
          />
        </Form.Item>
        <Form.Item name={namePriceTo} label={labelPriceTo}>
          <Input
            allowClear
            onClick={toggleMenu}
            placeholder="Giá đến"
            value={toValue}
            onChange={(e) => setToValue(e.target.value)}
          />
        </Form.Item>
      </Space.Compact>
      {generateMenu()}
    </>
  );
};
