import { Row, theme } from 'antd';
import { CSSProperties, ReactNode } from 'react';

const { useToken } = theme;
const BottomFixed = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const { token } = useToken();
  return (
    <Row
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: token.colorBgLayout,
        zIndex: 999,
        ...style,
      }}
      justify="center"
    >
      {children}
    </Row>
  );
};

export default BottomFixed;
