#!/bin/bash
set -Eeuo pipefail

# ================== CẤU HÌNH ==================
VPS_USER="root"
VPS_HOST="187.52.125.5"
REMOTE_APP_DIR="/var/www/cchouse"
PM2_APP_NAME="cchouse"   # đổi đúng tên app trong `pm2 status`
HEALTH_CHECK_URL="http://187.52.125.5:3003"
HEALTH_RETRIES=10
HEALTH_INTERVAL=3

# Thư mục Git local: mặc định là thư mục chứa deploy.sh
LOCAL_REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

trap 'echo -e "${RED}==> Deploy thất bại tại dòng $LINENO.${NC}"' ERR

echo -e "${YELLOW}==> BƯỚC 1: Git add, commit và push trên máy local${NC}"

cd "$LOCAL_REPO_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo -e "${RED}==> $LOCAL_REPO_DIR không phải Git repo.${NC}"
  exit 1
fi

git add .

COMMIT_MSG="Deploy $(date '+%d-%m-%Y %H:%M:%S')"

if ! git diff --cached --quiet; then
  git commit -m "$COMMIT_MSG"
else
  echo "Không có thay đổi mới để commit."
fi

git push

echo -e "${GREEN}==> Git push hoàn tất.${NC}"

echo -e "${YELLOW}==> BƯỚC 2: SSH vào VPS và deploy${NC}"

ssh -o StrictHostKeyChecking=accept-new \
  "${VPS_USER}@${VPS_HOST}" \
  "REMOTE_APP_DIR='${REMOTE_APP_DIR}' PM2_APP_NAME='${PM2_APP_NAME}' bash -s" <<'REMOTE_SCRIPT'

set -Eeuo pipefail

export PATH="$HOME/.bun/bin:/usr/local/bin:$PATH"

cd "$REMOTE_APP_DIR"

if ! command -v bun >/dev/null 2>&1; then
  echo "==> Thiếu bun trên VPS. Cài: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

echo "==> Git pull code mới nhất..."
git pull --ff-only

echo "==> Build Next.js (đã gồm npm i + copy-files)..."
npm run build

echo "==> Khởi động lại ứng dụng PM2: $PM2_APP_NAME"
pm2 restart "$PM2_APP_NAME" --update-env

echo "==> Lưu trạng thái PM2..."
pm2 save

echo "==> Danh sách ứng dụng PM2:"
pm2 status

echo "==> Deploy trên VPS hoàn tất."

REMOTE_SCRIPT

echo -e "${YELLOW}==> BƯỚC 3: Kiểm tra website${NC}"

ok=0
for i in $(seq 1 "$HEALTH_RETRIES"); do
  if curl -fsS --max-time 15 "$HEALTH_CHECK_URL" >/dev/null; then
    ok=1
    break
  fi
  echo "Lần $i/$HEALTH_RETRIES: chưa phản hồi, thử lại sau ${HEALTH_INTERVAL}s..."
  sleep "$HEALTH_INTERVAL"
done

if [ "$ok" -eq 1 ]; then
  echo -e "${GREEN}==> Deploy thành công! Website đang phản hồi.${NC}"
else
  echo -e "${RED}==> Cảnh báo: Website chưa phản hồi tại ${HEALTH_CHECK_URL}${NC}"
  echo "Kiểm tra trên VPS bằng lệnh: pm2 logs ${PM2_APP_NAME} --lines 100"
  exit 1
fi

echo -e "${GREEN}==> HOÀN TẤT DEPLOY.${NC}"