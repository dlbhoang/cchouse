import { Typography } from 'antd';
import { ReactNode } from 'react';

const ReadMore = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <Typography.Paragraph
      ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}
    >
      {children}
    </Typography.Paragraph>
  );
};
export default ReadMore;
