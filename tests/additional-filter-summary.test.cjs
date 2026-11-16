const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('src/lib/components/admin/property/filter/activeFilters.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const sandbox = { exports: {} };
vm.runInNewContext(code, sandbox);
const summary = (model, labels) => Array.from(sandbox.exports.additionalFilterSummary(model, labels));
test('counts a range as one criterion and excludes filters outside the More dialog', () => {
  assert.deepEqual(summary({ FloorFrm: 2, FloorTo: 3, PriceFrm: 10, Status: [1], ProvinceId: 1 }), ['Số tầng: 2–3']);
  assert.deepEqual(summary({ FloorFrm: 5, BathroomTo: 2 }), ['Số tầng: 5+', 'Phòng tắm, vệ sinh: ≤ 2']);
});
test('resolves selected labels and counts a multi-select as one criterion', () => {
  assert.deepEqual(summary({ Direction: '1,2', Legal: [3], FurnitureIds: ['Nội thất cao cấp'] }, { Direction: { 1: 'Đông', 2: 'Tây' }, Legal: { 3: 'Sổ hồng' } }), ['Hướng nhà: Đông, Tây', 'Pháp lý: Sổ hồng', 'Nội thất: Nội thất cao cấp']);
});
test('includes staff, dates and active checkboxes; ignores empty and false values', () => {
  assert.deepEqual(summary({ Direction: [], CustomerType: 0, Legal: '', IsMonopoly: 'false' }), []);
  assert.deepEqual(summary({ CustomerType: 6, UserAdminId: 7, fromDate: '2026-11-01', IsMonopoly: 'true' }, { UserAdminId: { 7: 'An' } }), ['Nhận diện khách hàng: Đấu giá', 'Nhân viên: An', 'Thời gian: 2026-11-01 → …', 'Độc quyền']);
});
