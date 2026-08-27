#!/bin/bash
set -e  # Dừng ngay nếu có lệnh nào lỗi

# ===== CẤU HÌNH =====
VPS_USER="root"
VPS_HOST="187.52.125.5"
MK="bodanduongaA@2026"          # <-- Nên đổi mật khẩu VPS này rồi cập nhật lại đây
REMOTE_APP_DIR="/var/www/cchouse"
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

echo "==> Đang build..."
npm run build

echo "==> Copy public/ và .next/static/ vào .next/standalone (bắt buộc với Next.js standalone mode)..."
cp -r public "${REMOTE_APP_DIR}/.next/standalone/public"
cp -r .next/static "${REMOTE_APP_DIR}/.next/standalone/.next/static"

echo "==> Xóa process cũ và start lại sạch (tránh lỗi 400 Bad Request do header/connection cũ)..."
pm2 delete "${PM2_APP_NAME}" || true
NODE_OPTIONS="--max-http-header-size=32768" pm2 start "${REMOTE_APP_DIR}/.next/standalone/server.js" --name "${PM2_APP_NAME}"
pm2 save

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