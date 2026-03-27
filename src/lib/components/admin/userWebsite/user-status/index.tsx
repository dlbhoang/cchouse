import { Badge, BadgeProps } from 'antd';

const badgeColorMap: Record<string, BadgeProps['status']> = {
  'Chưa xác thực': 'default',
  'Chờ duyệt': 'processing',
  'Đã xác thực': 'success',
};
const UserWebsiteStatus = ({ value }: { value: string }) => {
  return <Badge status={badgeColorMap[value]} text={value} size="small" />;
};

export default UserWebsiteStatus;
