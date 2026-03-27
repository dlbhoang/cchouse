
const tagColorMap: Record<string, string> = {
  'Chờ xử lý': 'warning',
  'Hết hiệu lực': 'default',
  'Đang hiển thị': 'success',
  'Tạm ẩn': 'processing',
  'Đã giao dịch': 'gold',
  default: 'error',
};

export const tagColor = (val?: string): string => tagColorMap[val ?? 'default'];
