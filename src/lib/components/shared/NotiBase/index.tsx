import { Button, Space, notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';
export const NotiBase = (
  type: NotificationType,
  message: string | undefined,
  callback?: () => void
) => {
  const btn = (
    <Space>
      <Button type="link" size="small" onClick={callback}>
        Xem thông tin
      </Button>
    </Space>
  );

  notification.config({
    maxCount: 1,
    placement: 'top',
  });
  notification[type]({
    message,
    btn: callback && btn,
  });
};
