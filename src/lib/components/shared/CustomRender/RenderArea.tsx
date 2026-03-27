import { Space, Typography } from 'antd';

const RenderArea = ({
  area,
  width,
  length,
  backSide,
  title,
}: {
  area: number;
  width?: number;
  length?: number;
  backSide?: number;
  title?: string;
}) => {
  return (
    <Space direction="vertical">
      <div>
        {title && <Typography.Text strong>{title}</Typography.Text>}
        {area > 0 && (
          <>
            {area}m<sup>2</sup>{' '}
          </>
        )}
        {(width ?? 0) > 0 && (length ?? 0) > 0 && ` (${width}x${length})m`}
      </div>
      {backSide && <span style={{ color: '#1677ff' }}>MH: {backSide}m</span>}
    </Space>
  );
};
export default RenderArea;
