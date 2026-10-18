const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/lib/components/admin/news/form/validation.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const sandbox = { exports: {} };
vm.runInNewContext(compiled, sandbox);
const { validateNews, isContentEmpty } = sandbox.exports;
const valid = { NewsTypeId: 1, SourceType: 'write', Thumbnail: [{ status: 'done', url: 'test.png' }], Title: 'Title', Summary: 'Summary', Content: '<p>Body</p>' };
test('valid article passes', () => assert.equal(Object.keys(validateNews(valid)).length, 0));
for (const field of ['NewsTypeId', 'SourceType', 'Title', 'Summary', 'Content']) {
  test(`${field} is required`, () => assert.ok(validateNews({ ...valid, [field]: '' })[field]));
}
for (const html of ['', '<p><br></p>', '<p>&nbsp;</p>', '<p>&#160;</p>', '<p>&#xA0;</p>', '<p> \u00a0 </p>']) {
  test(`empty editor content ${JSON.stringify(html)} is blocked`, () => assert.equal(isContentEmpty(html), true));
}
test('missing image is blocked', () => assert.ok(validateNews({ ...valid, Thumbnail: [] }).Thumbnail));
test('failed image is blocked', () => assert.ok(validateNews({ ...valid, Thumbnail: [{ status: 'error' }] }).Thumbnail));
test('uploading image is blocked', () => assert.ok(validateNews({ ...valid, Thumbnail: [{ status: 'uploading' }] }).Thumbnail));
test('shared article requires a source', () => assert.ok(validateNews({ ...valid, SourceType: 'share', Source: '' }).Source));
test('shared article with a source passes', () => assert.equal(Object.keys(validateNews({ ...valid, SourceType: 'share', Source: 'https://example.com/article' })).length, 0));
test('title over 150 is blocked', () => assert.ok(validateNews({ ...valid, Title: 'T'.repeat(151) }).Title));
test('summary over 350 is blocked', () => assert.ok(validateNews({ ...valid, Summary: 'S'.repeat(351) }).Summary));
test('title 150 and summary 350 are allowed', () => assert.equal(Object.keys(validateNews({ ...valid, Title: 'T'.repeat(150), Summary: 'S'.repeat(350) })).length, 0));
