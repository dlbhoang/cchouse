
const tagColorMap: Record<string, string> = {
  'Chờ xử lý': 'warning',
  'Hết hiệu lực': 'default',
  'Đang hiển thị': 'success',
  'Từ chối/Hủy': 'error',
  'Từ chối': 'error',
  'Hủy': 'error',
  'Tạm ẩn/Tạm ngưng': 'processing',
  'Tạm ẩn': 'processing',
  'Tạm ngưng': 'processing',
  'Đã giao dịch': 'gold',
};

export const tagColor = (val?: string): string => {
  const status = val?.trim();
  if (!status) return 'error';
  return tagColorMap[status] ?? 'error';
};
