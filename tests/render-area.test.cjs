const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const source = fs.readFileSync(path.join(__dirname, '../src/lib/components/shared/CustomRender/RenderArea.tsx'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
const sandbox = { exports: {}, require };
vm.runInNewContext(compiled, sandbox);
const Area = sandbox.exports.default;
const text = (backSide) => renderToStaticMarkup(React.createElement(Area, { area: 105, width: 7, length: 19, backSide })).replace(/<[^>]*>/g, '').trim();
test('zero rear width does not append a visible zero to the dimensions', () => {
  assert.ok(text(0).endsWith('(7x19)m'));
});
test('positive rear width remains visible', () => {
  assert.match(text(30), /MH: 30m$/);
});
