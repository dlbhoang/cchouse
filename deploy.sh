5#!/bin/bash
set -Eeuo pipefail

# ================== CẤU HÌNH ==================
VPS_USER="root"
VPS_HOST="187.52.125.5"
REMOTE_APP_DIR="/var/www/cchouse"
HEALTH_CHECK_URL="http://187.52.125.5:3003"

# Thư mục Git local: mặc định là thư mục chứa deploy.sh
LOCAL_REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

trap 'echo -e "${RED}==> Deploy thất bại tại dòng $LINENO.${NC}"' ERR

echo -e "${YELLOW}==> BƯỚC 1: Git add, commit và push trên máy local${NC}"

cd "$LOCAL_REPO_DIR"

git add .

# Commit message theo ngày giờ hiện tại
COMMIT_MSG="Deploy $(date '+%d-%m-%Y %H:%M:%S')"

if ! git diff --cached --quiet; then
    git commit -m "$COMMIT_MSG"
else
    echo "Không có thay đổi mới để commit."
fi

git push

echo -e "${GREEN}==> Git push hoàn tất.${NC}"

echo -e "${YELLOW}==> BƯỚC 2: SSH vào VPS và deploy${NC}"

# Dùng SSH key hoặc nhập mật khẩu SSH khi được yêu cầu
ssh -o StrictHostKeyChecking=accept-new \
    "${VPS_USER}@${VPS_HOST}" \
    "REMOTE_APP_DIR='${REMOTE_APP_DIR}' bash -s" <<'REMOTE_SCRIPT'

set -Eeuo pipefail

cd "$REMOTE_APP_DIR"

echo "==> Git pull code mới nhất..."
git pull --ff-only

echo "==> Cài dependencies..."
npm install

echo "==> Build Next.js..."
npm run build

echo "==> Khởi động lại tất cả ứng dụng PM2..."
pm2 restart all

echo "==> Lưu trạng thái PM2..."
pm2 save

echo "==> Danh sách ứng dụng PM2:"
pm2 status

echo "==> Deploy trên VPS hoàn tất."

REMOTE_SCRIPT

echo -e "${YELLOW}==> BƯỚC 3: Kiểm tra website${NC}"

sleep 3

if curl -fsS --max-time 15 "$HEALTH_CHECK_URL" >/dev/null; then
    echo -e "${GREEN}==> Deploy thành công! Website đang phản hồi.${NC}"
else
    echo -e "${RED}==> Cảnh báo: Website chưa phản hồi tại ${HEALTH_CHECK_URL}${NC}"
    echo "Kiểm tra trên VPS bằng lệnh: pm2 logs --lines 100"
    exit 1
fi

echo -e "${GREEN}==> HOÀN TẤT DEPLOY.${NC}"
