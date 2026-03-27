import { Card, CardProps, theme } from 'antd';

const { useToken } = theme;

const MyCard = ({ title, extra, children, size, ...props }: CardProps) => {
  const { token } = useToken();
  const cardHeadStyle = { borderBlockEnd: `1px solid ${token.colorPrimary}` };
  return (
    <Card
      title={title}
      size={size ?? 'small'}
      styles={{
        header: cardHeadStyle,
      }}
      style={{ boxShadow: 'none' }}
      bordered={false}
      extra={extra}
      {...props}
    >
      {children}
    </Card>
  );
};

export default MyCard;
