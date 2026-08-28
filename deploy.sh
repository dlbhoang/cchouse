#!/bin/bash
set -e  # Dừng ngay nếu có lệnh nào lỗi

# ===== CẤU HÌNH =====
VPS_USER="root"
VPS_HOST="187.52.125.5"
MK="bodanduongaA@2026"          # <-- Nên đổi mật khẩu VPS này rồi cập nhật lại đây
REMOTE_APP_DIR="/var/www/cchouse"
STANDALONE_DIR="${REMOTE_APP_DIR}/.next/standalone"
PM2_APP_NAME="cchouse"
HEALTH_CHECK_URL="http://187.52.125.5:3003"   # Đổi lại nếu app chạy port khác

# ===== MÀU SẮC LOG =====
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kiểm tra sshpass đã cài chưa
if ! command -v sshpass &> /dev/null; then
  echo -e "${RED}==> Chưa cài sshpass. Cài bằng lệnh: brew install sshpass (macOS) hoặc apt install sshpass (Linux)${NC}"
  exit 1
fi

echo -e "${YELLOW}==> Kết nối VPS và deploy '${PM2_APP_NAME}'...${NC}"

sshpass -p "$MK" ssh -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_HOST}" bash -s <<EOF
set -e
cd "${REMOTE_APP_DIR}"

echo "==> Loại bỏ mọi thay đổi cục bộ trên VPS (tránh lỗi git pull bị chặn)..."
git fetch origin
git reset --hard origin/main
git clean -fd -e node_modules -e .next -e playwright-report -e test-results

echo "==> Đang git pull..."
git pull

echo "==> Đang cài dependencies..."
npm install

echo "==> Backup static assets bản build cũ (để user đang mở tab cũ không bị 404 chunk)..."
rm -rf /tmp/static_backup
mkdir -p /tmp/static_backup
if [ -d "${STANDALONE_DIR}/.next/static" ]; then
  cp -r "${STANDALONE_DIR}/.next/static/." /tmp/static_backup/ 2>/dev/null || true
fi

echo "==> Đang build..."
npm run build

echo "==> Copy public/ vào .next/standalone (bắt buộc với Next.js standalone mode)..."
rm -rf "${STANDALONE_DIR}/public"
cp -r public "${STANDALONE_DIR}/public"

echo "==> Merge static: giữ chunk cũ + thêm chunk mới (không xóa cũ ngay)..."
mkdir -p "${STANDALONE_DIR}/.next/static"
cp -r /tmp/static_backup/. "${STANDALONE_DIR}/.next/static/" 2>/dev/null || true
cp -r .next/static/. "${STANDALONE_DIR}/.next/static/"

echo "==> Xóa process cũ và start lại sạch (cwd đúng = thư mục standalone, tránh lỗi resolve static/asset)..."
pm2 delete "${PM2_APP_NAME}" || true
cd "${STANDALONE_DIR}"
NODE_OPTIONS="--max-http-header-size=32768" pm2 start server.js --name "${PM2_APP_NAME}" --cwd "${STANDALONE_DIR}"
pm2 save

echo "==> Dọn dẹp static backup quá 3 ngày (tránh phình dung lượng ổ đĩa theo thời gian)..."
find "${STANDALONE_DIR}/.next/static/chunks" -type f -mtime +3 -delete 2>/dev/null || true

echo "==> Deploy xong trên VPS."
EOF

if [ $? -ne 0 ]; then
  echo -e "${RED}==> Deploy thất bại. Kiểm tra log ở trên.${NC}"
  exit 1
fi

echo -e "${YELLOW}==> Kiểm tra health check...${NC}"
sleep 3
if curl -sf "$HEALTH_CHECK_URL" > /dev/null; then
  echo -e "${GREEN}==> Deploy thành công! Website đang phản hồi bình thường.${NC}"
else
  echo -e "${RED}==> CẢNH BÁO: Website không phản hồi sau khi deploy. Kiểm tra lại bằng: pm2 logs ${PM2_APP_NAME}${NC}"
  exit 1
fi

echo -e "${GREEN}==> Hoàn tất.${NC}"