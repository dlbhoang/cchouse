/**
 * ward-agencies.test.js
 * ─────────────────────────────────────────────────────────────────
 * Test kiểm tra dữ liệu cơ quan hành chính trong ward-agencies.ts:
 *
 *   1. Có đủ 168 phường/xã/đặc khu, WardId liên tục 1..168, không trùng.
 *   2. Mỗi phường có đủ CẢ 7 NHÓM cơ quan theo interface AgencyMap
 *      (Văn phòng công chứng, Văn phòng đất đai, Chi cục thuế,
 *      UBND phường, Tòa án, Sở tư pháp, Thừa phát lại).
 *   3. Mỗi nhóm phải có ít nhất 1 cơ quan, và mỗi cơ quan phải có
 *      "name" + "address" không rỗng.
 *   4. Kiểm tra riêng 5 nhóm thực sự hiển thị trên UI (AGENCY_TAGS
 *      trong ward-lookup.tsx) — vì đây là phần người dùng thấy trực
 *      tiếp trên dialog "Tra cứu hành chính".
 *   5. Test hàm findWardAgencyData (tra theo id / theo tên / theo tên
 *      có tiền tố "Phường"/"Xã"/"Đặc khu").
 *
 * CHẠY (chọn 1 trong 2 cách):
 *
 *   Cách A — dùng ts-node (đơn giản nhất, không cần build):
 *     npm install -D ts-node          # nếu project chưa có
 *     npx ts-node ward-agencies.test.js
 *
 *     Nếu project dùng "type": "module" trong package.json, dùng:
 *     npx ts-node --compiler-options '{"module":"commonjs"}' ward-agencies.test.js
 *
 *   Cách B — tự build .ts → .js bằng tsc rồi chạy node thuần:
 *     npx tsc src/data/ward-agencies.ts --module commonjs --target es2020 --outDir dist
 *     node ward-agencies.test.js
 *     (nhớ trỏ đúng đường dẫn ward-agencies.ts thật của project ở dòng trên)
 *
 *   Có thể override đường dẫn file nguồn bằng biến môi trường WARD_AGENCIES_PATH,
 *   ví dụ project của bạn để ở src/data/ward-agencies.ts:
 *     WARD_AGENCIES_PATH=./src/data/ward-agencies.ts npx ts-node ward-agencies.test.js
 *
 * Script in ra:
 *   - Tổng số phường có đủ 7/7 nhóm cơ quan.
 *   - Danh sách cụ thể phường nào còn THIẾU nhóm nào (nếu có).
 *   - Kết luận "ĐÃ ĐỦ HẾT" hay "CHƯA ĐỦ" dựa trên dữ liệu thực tế.
 * ─────────────────────────────────────────────────────────────────
 */

const path = require("path");
const fs = require("fs");

// Tự dò đường dẫn file ward-agencies thật trong project, theo thứ tự ưu tiên:
//   1) biến môi trường WARD_AGENCIES_PATH (nếu bạn set tay)
//   2) ./src/data/ward-agencies.ts   (cấu trúc Next.js phổ biến, khớp alias @/data/...)
//   3) ./data/ward-agencies.ts
//   4) ./dist/ward-agencies.js       (bản đã build sẵn bằng tsc — Cách B)
//   5) ./ward-agencies.ts            (file để cùng cấp với test)
function resolveWardAgenciesPath() {
  const candidates = [
    process.env.WARD_AGENCIES_PATH,
    "./src/data/ward-agencies.ts",
    "./data/ward-agencies.ts",
    "./dist/ward-agencies.js",
    "./ward-agencies.ts",
  ].filter(Boolean);

  for (const candidate of candidates) {
    const resolved = path.resolve(process.cwd(), candidate);
    if (fs.existsSync(resolved)) return resolved;
  }

  throw new Error(
    "Không tìm thấy file ward-agencies.ts/.js ở các đường dẫn mặc định.\n" +
      "  → Hãy chạy lại với biến môi trường, ví dụ:\n" +
      '    WARD_AGENCIES_PATH=./src/data/ward-agencies.ts npx ts-node ward-agencies.test.js\n' +
      "  Đã thử các đường dẫn: " +
      candidates.map((c) => path.resolve(process.cwd(), c)).join(", ")
  );
}

const WARD_AGENCIES_PATH = resolveWardAgenciesPath();
console.log(`📂 Đang đọc dữ liệu từ: ${WARD_AGENCIES_PATH}\n`);

// Dữ liệu từ ward-agencies.ts/.js thật của project (require được cả .ts khi
// chạy qua ts-node, hoặc .js nếu bạn tự build bằng tsc trước — Cách B).
const {
  WARD_AGENCIES,
  WARD_AGENCIES_MAP,
  findWardAgencyData,
} = require(WARD_AGENCIES_PATH);

// 7 nhóm cơ quan theo interface AgencyMap trong ward-agencies.ts
const ALL_AGENCY_KEYS = [
  "Văn phòng công chứng",
  "Văn phòng đất đai",
  "Chi cục thuế",
  "Ủy ban nhân dân phường",
  "Tòa án",
  "Sở tư pháp",
  "Thừa phát lại",
];

// 5 nhóm thực sự hiển thị trên UI tab "Tra cứu hành chính"
// (AGENCY_TAGS trong ward-lookup.tsx) — Tòa án & Thừa phát lại có
// trong data nhưng KHÔNG được render ra UI.
const UI_AGENCY_KEYS = [
  "Văn phòng công chứng",
  "Văn phòng đất đai",
  "Chi cục thuế",
  "Ủy ban nhân dân phường",
  "Sở tư pháp",
];

const EXPECTED_TOTAL_WARDS = 168;

// ───────────────────────── test runner mini ─────────────────────────
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
    console.log(`  ❌ ${name}`);
    console.log(`     → ${err.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function section(title) {
  console.log(`\n${title}`);
}

// ─────────────────────────────────────────────────────────────────
// 1. KIỂM TRA TỔNG SỐ PHƯỜNG & WardId
// ─────────────────────────────────────────────────────────────────
section("1) Tổng số phường & WardId");

test(`Có đúng ${EXPECTED_TOTAL_WARDS} phường/xã/đặc khu`, () => {
  assert(
    WARD_AGENCIES.length === EXPECTED_TOTAL_WARDS,
    `Thực tế có ${WARD_AGENCIES.length} phường, kỳ vọng ${EXPECTED_TOTAL_WARDS}`
  );
});

test("WardId không trùng nhau", () => {
  const ids = WARD_AGENCIES.map((w) => w.WardId);
  const uniq = new Set(ids);
  assert(
    uniq.size === ids.length,
    `Có ${ids.length - uniq.size} WardId bị trùng`
  );
});

test("WardId liên tục từ 1 đến 168, không thiếu số nào", () => {
  const ids = new Set(WARD_AGENCIES.map((w) => w.WardId));
  const missing = [];
  for (let i = 1; i <= EXPECTED_TOTAL_WARDS; i++) {
    if (!ids.has(i)) missing.push(i);
  }
  assert(
    missing.length === 0,
    `Thiếu các WardId: ${missing.join(", ")}`
  );
});

// ─────────────────────────────────────────────────────────────────
// 2. KIỂM TRA ĐỦ 7/7 NHÓM CƠ QUAN (toàn bộ AgencyMap)
// ─────────────────────────────────────────────────────────────────
section("2) Đủ 7/7 nhóm cơ quan theo interface AgencyMap");

// missingReport[wardId] = { wardName, missingKeys: [...], emptyKeys: [...] }
const missingReport = [];

for (const ward of WARD_AGENCIES) {
  const missingKeys = [];
  const emptyKeys = [];
  const badItemKeys = []; // có nhóm nhưng item thiếu name/address

  for (const key of ALL_AGENCY_KEYS) {
    const list = ward.Agencies ? ward.Agencies[key] : undefined;

    if (list === undefined || list === null) {
      missingKeys.push(key);
      continue;
    }
    if (!Array.isArray(list) || list.length === 0) {
      emptyKeys.push(key);
      continue;
    }
    const hasBadItem = list.some(
      (item) =>
        !item ||
        typeof item.name !== "string" ||
        item.name.trim() === "" ||
        typeof item.address !== "string" ||
        item.address.trim() === ""
    );
    if (hasBadItem) badItemKeys.push(key);
  }

  if (missingKeys.length || emptyKeys.length || badItemKeys.length) {
    missingReport.push({
      wardId: ward.WardId,
      wardName: ward.WardName,
      wardType: ward.WardType,
      missingKeys,
      emptyKeys,
      badItemKeys,
    });
  }
}

test("Tất cả 168 phường có đủ 7/7 nhóm cơ quan (không thiếu key)", () => {
  const wardsWithMissingKey = missingReport.filter((r) => r.missingKeys.length > 0);
  if (wardsWithMissingKey.length > 0) {
    const detail = wardsWithMissingKey
      .map((r) => `#${r.wardId} ${r.wardName} → thiếu: [${r.missingKeys.join(", ")}]`)
      .join("\n       ");
    throw new Error(
      `${wardsWithMissingKey.length} phường thiếu hẳn 1 hay nhiều nhóm cơ quan:\n       ${detail}`
    );
  }
});

test("Tất cả 168 phường: mỗi nhóm cơ quan có ≥1 cơ quan (không rỗng)", () => {
  const wardsWithEmpty = missingReport.filter((r) => r.emptyKeys.length > 0);
  if (wardsWithEmpty.length > 0) {
    const detail = wardsWithEmpty
      .map((r) => `#${r.wardId} ${r.wardName} → rỗng: [${r.emptyKeys.join(", ")}]`)
      .join("\n       ");
    throw new Error(
      `${wardsWithEmpty.length} phường có nhóm cơ quan rỗng (mảng []):\n       ${detail}`
    );
  }
});

test("Tất cả cơ quan đều có name + address không rỗng", () => {
  const wardsWithBadItem = missingReport.filter((r) => r.badItemKeys.length > 0);
  if (wardsWithBadItem.length > 0) {
    const detail = wardsWithBadItem
      .map((r) => `#${r.wardId} ${r.wardName} → lỗi item: [${r.badItemKeys.join(", ")}]`)
      .join("\n       ");
    throw new Error(
      `${wardsWithBadItem.length} phường có item cơ quan thiếu name/address:\n       ${detail}`
    );
  }
});

// ─────────────────────────────────────────────────────────────────
// 3. KIỂM TRA RIÊNG 5 NHÓM HIỂN THỊ TRÊN UI (AGENCY_TAGS)
// ─────────────────────────────────────────────────────────────────
section("3) Đủ 5/5 nhóm cơ quan thực sự hiển thị trên UI (AGENCY_TAGS)");

const uiMissingReport = [];
for (const ward of WARD_AGENCIES) {
  const missing = UI_AGENCY_KEYS.filter((key) => {
    const list = ward.Agencies ? ward.Agencies[key] : undefined;
    return !Array.isArray(list) || list.length === 0;
  });
  if (missing.length > 0) {
    uiMissingReport.push({ wardId: ward.WardId, wardName: ward.WardName, missing });
  }
}

test("Tất cả 168 phường có đủ 5 nhóm cơ quan hiển thị trên UI", () => {
  if (uiMissingReport.length > 0) {
    const detail = uiMissingReport
      .map((r) => `#${r.wardId} ${r.wardName} → thiếu trên UI: [${r.missing.join(", ")}]`)
      .join("\n       ");
    throw new Error(
      `${uiMissingReport.length} phường sẽ hiện "Không có dữ liệu cơ quan" cho ít nhất 1 tag trên UI:\n       ${detail}`
    );
  }
});

// ─────────────────────────────────────────────────────────────────
// 4. KIỂM TRA findWardAgencyData (logic lookup thực tế app dùng)
// ─────────────────────────────────────────────────────────────────
section("4) findWardAgencyData() — lookup theo id / tên / tên có tiền tố");

test("Tra đúng theo WardId hợp lệ (WardId=1)", () => {
  const data = findWardAgencyData(1);
  assert(data && data.WardId === 1, "Không tìm thấy ward #1");
});

test("Tra theo WardName không tiền tố (vd: 'Sài Gòn')", () => {
  const data = findWardAgencyData(undefined, "Sài Gòn");
  assert(data && data.WardName === "Sài Gòn", "Không tra được theo tên thuần");
});

test("Tra theo WardName có tiền tố 'Phường' (vd: 'Phường Sài Gòn')", () => {
  const data = findWardAgencyData(undefined, "Phường Sài Gòn");
  assert(data && data.WardName === "Sài Gòn", "Không tra được khi có tiền tố 'Phường'");
});

test("Tra theo WardName có tiền tố 'Xã' không dấu, hoa/thường lẫn lộn", () => {
  const xaWard = WARD_AGENCIES.find((w) => w.WardType === "xã");
  assert(xaWard, "Không có ward kiểu 'xã' trong dữ liệu để test");
  const noAccentUpper = `XA ${xaWard.WardName}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  const data = findWardAgencyData(undefined, noAccentUpper);
  assert(
    data && data.WardId === xaWard.WardId,
    `Không tra được '${xaWard.WardName}' qua tên không dấu/viết hoa: "${noAccentUpper}"`
  );
});

test("Tra theo WardId KHÔNG khớp nhưng WardName khớp → fallback đúng ward theo tên", () => {
  const data = findWardAgencyData(999999, "Sài Gòn");
  assert(
    data && data.WardName === "Sài Gòn",
    "Không fallback đúng theo tên khi WardId sai"
  );
});

test("WardId và WardName đều không khớp → trả về undefined", () => {
  const data = findWardAgencyData(999999, "Phường Không Tồn Tại XYZ");
  assert(data === undefined, "Phải trả về undefined khi không tìm thấy gì cả");
});

// ─────────────────────────────────────────────────────────────────
// TỔNG KẾT
// ─────────────────────────────────────────────────────────────────
section("═══════════════════════ TỔNG KẾT ═══════════════════════");

const wardsFullyOk =
  WARD_AGENCIES.length -
  new Set(missingReport.map((r) => r.wardId)).size;

console.log(`Tổng số phường/xã/đặc khu          : ${WARD_AGENCIES.length}`);
console.log(`Số phường ĐỦ 7/7 nhóm cơ quan (data) : ${wardsFullyOk}`);
console.log(`Số phường THIẾU ít nhất 1 nhóm (data): ${missingReport.length}`);
console.log(`Số phường THIẾU ít nhất 1 nhóm (UI)  : ${uiMissingReport.length}`);

if (missingReport.length > 0) {
  console.log("\n📋 Chi tiết các phường còn thiếu dữ liệu cơ quan (toàn bộ 7 nhóm):");
  for (const r of missingReport) {
    const parts = [];
    if (r.missingKeys.length) parts.push(`thiếu key: ${r.missingKeys.join(", ")}`);
    if (r.emptyKeys.length) parts.push(`rỗng: ${r.emptyKeys.join(", ")}`);
    if (r.badItemKeys.length) parts.push(`item lỗi: ${r.badItemKeys.join(", ")}`);
    console.log(`  - #${r.wardId} [${r.wardType}] ${r.wardName}: ${parts.join(" | ")}`);
  }
}

console.log(`\nKết quả test: ${passed} passed, ${failed} failed`);

if (failed === 0 && missingReport.length === 0) {
  console.log("\n🎉 KẾT LUẬN: Dữ liệu cơ quan hành chính ĐÃ ĐẦY ĐỦ cho toàn bộ 168 phường/xã/đặc khu.");
} else {
  console.log(
    "\n⚠️  KẾT LUẬN: Dữ liệu cơ quan hành chính CHƯA ĐẦY ĐỦ — xem chi tiết danh sách thiếu ở trên."
  );
}

process.exit(failed === 0 ? 0 : 1);
