import { Grid, Spin } from 'antd';
import { ReactNode, useState } from 'react';

const { useBreakpoint } = Grid;
const RightFixed = ({
  children,
  visible,
}: {
  children: ReactNode;
  visible: boolean;
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const screens = useBreakpoint();
  let timerId: NodeJS.Timeout;
  // const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
  //   setScrollTop(event.currentTarget.scrollTop);
  //   setIsScrolling(true);
  //   clearTimeout(timerId);
  //   timerId = setTimeout(() => {
  //     setIsScrolling(false);
  //   }, 500);
  // };
  return (
    <div
      style={{
        position: 'absolute',
        maxWidth: screens.lg ? '35%' : '100%',
        height: '100%',
        float: 'left',
        right: 0,
        zIndex: 1500,
        backgroundColor: '#E5E7EB',
        overflow: 'auto',
        padding: 8,
        display: visible ? 'block' : 'none',
      }}
      // onScroll={handleScroll}
    >
      {children}
      {isScrolling && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: scrollTop + window.innerHeight / 2,
          }}
        >
          <Spin size="default" />
        </div>
      )}
    </div>
  );
};

export default RightFixed;
