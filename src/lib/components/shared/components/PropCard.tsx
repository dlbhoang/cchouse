import { Card, Space, Tag, Typography } from 'antd';

const { Meta } = Card;

type Props = {
  id: string | number;
  title: string;
  image: string;
  tagBgColor: string;
};

const PropCard = ({ id, image, title, tagBgColor }: Props) => {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<img alt={title} src={image} />}
      size="small"
    >
      <Space>
        <Tag style={{ color: '#ffffff', backgroundColor: tagBgColor }}>
          {`Mã: ${id}`}
        </Tag>
        <Typography.Text strong>{title}</Typography.Text>
      </Space>
      <Meta title="Europe Street beat" description="www.instagram.com" />
    </Card>
  );
};

export default PropCard;
