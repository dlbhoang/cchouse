#!/usr/bin/env bash
set -Eeuo pipefail

VPS_USER="root"
VPS_HOST="187.52.125.5"
REMOTE_APP_DIR="/var/www/cchouse"
PM2_APP_NAME="map"
BRANCH="main"
HEALTH_RETRIES=30
HEALTH_INTERVAL=2
LOCAL_REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

trap 'echo -e "${RED}==> Deploy thất bại tại dòng $LINENO.${NC}"' ERR

echo -e "${YELLOW}==> Commit và push mã nguồn${NC}"
cd "$LOCAL_REPO_DIR"
git rev-parse --is-inside-work-tree >/dev/null
git add .
if ! git diff --cached --quiet; then
  git commit -m "Deploy $(date '+%d-%m-%Y %H:%M:%S')"
fi
git push origin "$BRANCH"

echo -e "${YELLOW}==> Build release riêng trên VPS; bản đang chạy tiếp tục phục vụ${NC}"
ssh -o StrictHostKeyChecking=accept-new "${VPS_USER}@${VPS_HOST}" \
  "REMOTE_APP_DIR='${REMOTE_APP_DIR}' PM2_APP_NAME='${PM2_APP_NAME}' BRANCH='${BRANCH}' HEALTH_RETRIES='${HEALTH_RETRIES}' HEALTH_INTERVAL='${HEALTH_INTERVAL}' bash -s" <<'REMOTE_SCRIPT'
set -Eeuo pipefail
export PATH="$HOME/.bun/bin:/usr/local/bin:$PATH"

APP_DIR="$REMOTE_APP_DIR"
RELEASES_DIR="$APP_DIR/releases"
ACTIVE_STANDALONE="$APP_DIR/.next/standalone"
CLIENT_ERROR_LOG_DIR="$APP_DIR/.runtime/client-errors"
mkdir -p "$RELEASES_DIR" "$CLIENT_ERROR_LOG_DIR"
ROLLBACK_TARGET=""
PM2_TOUCHED=0

rollback() {
  local exit_code=$?
  trap - ERR
  if [ "$PM2_TOUCHED" -eq 1 ]; then
    echo "==> Release chưa khỏe; khôi phục release trước."
    pm2 stop "$PM2_APP_NAME" >/dev/null 2>&1 || true
    if [ -n "$ROLLBACK_TARGET" ] && [ -d "$ROLLBACK_TARGET" ]; then
      local rollback_tmp="$APP_DIR/.next/standalone-rollback-$$"
      ln -s "$ROLLBACK_TARGET" "$rollback_tmp"
      mv -Tf "$rollback_tmp" "$ACTIVE_STANDALONE"
    fi
    pm2 restart "$PM2_APP_NAME" --update-env || true
  fi
  exit "$exit_code"
}
trap rollback ERR

git -C "$APP_DIR" fetch --quiet origin "$BRANCH"
DEPLOY_REV="$(git -C "$APP_DIR" rev-parse FETCH_HEAD)"
DEPLOY_ID="$(date -u '+%Y%m%d%H%M%S')-${DEPLOY_REV:0:8}"
RELEASE_DIR="$RELEASES_DIR/$DEPLOY_ID"
mkdir -p "$RELEASE_DIR"

if [ ! -f "$APP_DIR/.env" ]; then
  echo "==> Thiếu $APP_DIR/.env; dừng trước khi đụng bản đang chạy."
  exit 1
fi
if ! cmp -s "$APP_DIR/package-lock.json" <(git -C "$APP_DIR" show "$DEPLOY_REV:package-lock.json"); then
  echo "==> package-lock.json thay đổi; cần cài dependencies riêng trước khi deploy an toàn."
  exit 1
fi

git -C "$APP_DIR" archive "$DEPLOY_REV" | tar -x -C "$RELEASE_DIR"
cp "$APP_DIR/.env" "$RELEASE_DIR/.env"
ln -s "$APP_DIR/node_modules" "$RELEASE_DIR/node_modules"

# Xóa cache Next cũ để dành chỗ cho build staging; cache không chứa mã đang chạy.
rm -rf "$APP_DIR/.next/cache"
AVAILABLE_KB="$(df -Pk "$APP_DIR" | awk 'NR == 2 {print $4}')"
if [ "$AVAILABLE_KB" -lt 900000 ]; then
  echo "==> VPS còn ${AVAILABLE_KB}KB trống; cần tối thiểu 900000KB để build staging an toàn."
  exit 1
fi

cd "$RELEASE_DIR"
echo "==> Build $DEPLOY_ID trong $RELEASE_DIR"
NEXT_TELEMETRY_DISABLED=1 ./node_modules/.bin/next build
bun copy-files.ts
test -f "$RELEASE_DIR/.next/standalone/server.js"

# Chạy thử release mới trên cổng riêng trước khi đổi symlink hoặc restart PM2.
SMOKE_LOG="/tmp/cchouse-smoke-$DEPLOY_ID.log"
(
  cd "$RELEASE_DIR/.next/standalone"
  exec env CLIENT_ERROR_LOG_DIR="$CLIENT_ERROR_LOG_DIR" PORT=3101 HOSTNAME=127.0.0.1 node server.js
) >"$SMOKE_LOG" 2>&1 &
SMOKE_PID=$!
SMOKE_OK=0
for _ in $(seq 1 20); do
  if curl -fsS --max-time 2 http://127.0.0.1:3101/api/auth/session >/dev/null; then
    SMOKE_OK=1
    break
  fi
  if ! kill -0 "$SMOKE_PID" 2>/dev/null; then break; fi
  sleep 1
done
kill "$SMOKE_PID" 2>/dev/null || true
wait "$SMOKE_PID" 2>/dev/null || true
if [ "$SMOKE_OK" -ne 1 ]; then
  cat "$SMOKE_LOG"
  rm -rf "$RELEASE_DIR"
  echo "==> Release staging không qua health check; bản hiện tại được giữ nguyên."
  exit 1
fi
rm -f "$SMOKE_LOG"
rm -rf "$RELEASE_DIR/.next/cache"

ROLLBACK_TARGET=""
if [ -L "$ACTIVE_STANDALONE" ]; then
  ROLLBACK_TARGET="$(readlink -f "$ACTIVE_STANDALONE")"
else
  # Chuyển đổi một lần từ thư mục build cũ sang symlink; chỉ dừng app sau khi
  # release mới đã build và qua smoke test.
  LEGACY_DIR="$RELEASES_DIR/legacy-$DEPLOY_ID/.next/standalone"
  mkdir -p "$(dirname "$LEGACY_DIR")"
  ROLLBACK_TARGET="$LEGACY_DIR"
  PM2_TOUCHED=1
  pm2 stop "$PM2_APP_NAME"
  mv "$ACTIVE_STANDALONE" "$LEGACY_DIR"
fi

SWITCH_TMP="$APP_DIR/.next/standalone-$DEPLOY_ID"
ln -s "$RELEASE_DIR/.next/standalone" "$SWITCH_TMP"
mv -Tf "$SWITCH_TMP" "$ACTIVE_STANDALONE"

export CLIENT_ERROR_LOG_DIR
PM2_TOUCHED=1
echo "==> Khởi động release mới: $DEPLOY_ID"
pm2 restart "$PM2_APP_NAME" --update-env
HEALTH_OK=0
for _ in $(seq 1 "$HEALTH_RETRIES"); do
  if curl -fsS --max-time 5 http://127.0.0.1:3000/api/auth/session >/dev/null; then
    HEALTH_OK=1
    break
  fi
  sleep "$HEALTH_INTERVAL"
done
if [ "$HEALTH_OK" -ne 1 ]; then
  echo "==> Health check release mới thất bại."
  false
fi
trap - ERR
PM2_TOUCHED=0
pm2 save
echo "==> Release $DEPLOY_ID đang chạy; PM2:"
pm2 describe "$PM2_APP_NAME" | sed -n '1,18p'

# Giữ release hiện tại và release trước để rollback, dọn phần còn lại.
CURRENT_TARGET="$(readlink -f "$ACTIVE_STANDALONE")"
for OLD_RELEASE in "$RELEASES_DIR"/*; do
  [ -d "$OLD_RELEASE" ] || continue
  [ "$OLD_RELEASE" = "$(dirname "$(dirname "$CURRENT_TARGET")")" ] && continue
  [ -n "$ROLLBACK_TARGET" ] && [ "$OLD_RELEASE" = "$(dirname "$(dirname "$ROLLBACK_TARGET")")" ] && continue
  rm -rf "$OLD_RELEASE"
done
REMOTE_SCRIPT

echo -e "${YELLOW}==> Xác nhận endpoint công khai${NC}"
ok=0
for _ in $(seq 1 "$HEALTH_RETRIES"); do
  if curl -fsS --max-time 10 "http://${VPS_HOST}:3000/api/auth/session" >/dev/null; then
    ok=1
    break
  fi
  sleep "$HEALTH_INTERVAL"
done
if [ "$ok" -ne 1 ]; then
  echo -e "${RED}==> VPS chưa phản hồi health check công khai.${NC}"
  exit 1
fi

echo -e "${GREEN}==> Deploy an toàn hoàn tất.${NC}"
