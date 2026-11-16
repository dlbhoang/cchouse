const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/lib/dev/admin-ui-fixtures.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const sandbox = { exports: {}, URLSearchParams };
vm.runInNewContext(compiled, sandbox);
const { adminUiQaEnabled, getAdminUiFixture } = sandbox.exports;
const get = (route, query = '') => getAdminUiFixture(route, new URLSearchParams(query));

test('fixtures require development and an explicit server opt-in', () => {
  assert.equal(adminUiQaEnabled({ NODE_ENV: 'production', ADMIN_UI_QA: '1' }), false);
  assert.equal(adminUiQaEnabled({ NODE_ENV: 'development' }), false);
  assert.equal(adminUiQaEnabled({ NODE_ENV: 'development', ADMIN_UI_QA: '1' }), true);
});
test('property pagination exposes unique populated rows across pages', () => {
  const first = get('Property', 'pageIndex=1&pageSize=10');
  const second = get('Property', 'pageIndex=2&pageSize=10');
  assert.equal(first.totalRow, 68);
  assert.equal(first.data.length, 10);
  assert.equal(second.data.length, 10);
  assert.equal(new Set([...first.data, ...second.data].map(x => x.Id)).size, 20);
  assert.equal(get('Property', 'pageIndex=7&pageSize=10').data.length, 8);
});
test('fixture rows have the nested values required by the actual property columns', () => {
  for (const row of get('Property').data) {
    assert.ok(row.PropAddress.DisplayAddress);
    assert.ok(Array.isArray(row.CustomerPhone));
    assert.ok(row.Area > 0);
  }
});
test('explicit empty search can exercise the actual empty component', () => {
  assert.equal(get('Property', 'Search=__empty__').data.length, 0);
  assert.equal(get('News', 'Search=__empty__').totalRow, 0);
  assert.equal(get('News/count', 'Search=__empty__').data, 0);
});
test('news category filtering preserves selected types', () => {
  assert.ok(get('News', 'NewsTypeIds=2').data.every(x => x.NewsTypeId === 2));
});
test('old/new address scenarios maintain linked wards and streets', () => {
  const old = get('Ward', 'IsNew=false').data;
  const current = get('Ward', 'IsNew=true').data;
  assert.ok(old.every(x => !x.IsNew));
  assert.ok(current.every(x => x.IsNew));
  for (const merge of get('MergeWard').data) {
    assert.ok(old.some(x => x.Id === merge.OldWardId));
    assert.ok(current.some(x => x.Id === merge.NewWardId));
  }
  assert.equal(get('Street', 'WardId=999').data.length, 0);
});
test('unrelated endpoints retain the normal proxy path', () => {
  assert.equal(get('Role'), null);
  assert.equal(get('Unknown'), null);
});
