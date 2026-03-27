import { Badge, BadgeProps } from 'antd';

const tagColorMap: Record<string, BadgeProps['color']> = {
  'Cá nhân': 'blue',
  'Công ty': 'green',
  'Môi giới': 'red',
};
const UserWebsiteType = ({
  text,
  children,
  placement,
}: {
  text: string;
  children: React.ReactNode;
  placement?: 'start' | 'end';
}) => {
  return (
    <Badge.Ribbon placement={placement} color={tagColorMap[text]} text={text}>
      {children}
    </Badge.Ribbon>
  );
};

export default UserWebsiteType;
