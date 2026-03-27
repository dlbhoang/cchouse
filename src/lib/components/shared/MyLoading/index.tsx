import { Spin } from 'antd';

const MyLoading = () => {
  return (
    <Spin tip="Loading" size="small">
      <div
        style={{
          padding: '50px',
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
        }}
      />
    </Spin>
  );
};

export default MyLoading;
