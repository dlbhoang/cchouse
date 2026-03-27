import { Tabs, TabsProps } from 'antd';

type Props = {
  onChange: (key: string) => void;
};
const BlockStatusTabs = ({ onChange }: Props) => {
  const data = [
    {
      value: true,
      text: `Hoạt động`,
    },
    {
      value: false,
      text: `Tạm khóa`,
    },
  ];

  const items: TabsProps['items'] = data.map((e) => ({
    key: e.value.toString(),
    label: e.text,
  }));

  return (
    <Tabs
      defaultActiveKey={data[0]?.value.toString()}
      items={items}
      onChange={onChange}
    />
  );
};

export default BlockStatusTabs;
