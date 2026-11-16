const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const jsx = require('react/jsx-runtime');
const source = fs.readFileSync('src/lib/components/shared/MySelect/Address/AddressSelectCustom.tsx', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
function setup(inline) {
  const values = { ProvinceId: 1, DistrictId: 2, WardId: 3, StreetId: 4 };
  let submitted = 0, closed = 0;
  const form = { getFieldValue: (key) => values[key], setFieldValue: (key, value) => { values[key] = value; }, setFieldsValue: (patch) => Object.assign(values, patch), submit: () => submitted++ };
  const sandbox = { exports: {}, require(name) {
    if (name.endsWith('.css')) return {};
    if (name === 'react/jsx-runtime') return jsx;
    if (name === 'react') return { useEffect() {}, useState: () => [undefined, () => {}] };
    if (name === 'antd') return { Form: { useWatch: (key) => values[key], Item: 'field' }, Button: 'button', Col: 'col', Row: 'row', Input: 'input', Switch: 'switch', Dropdown: 'dropdown', Typography: { Text: 'text' } };
    if (name === 'lucide-react') return { Check: 'icon', ChevronDown: 'icon', RefreshCw: 'icon', X: 'icon' };
    if (name.includes('myFormat')) return { CombineAddress: () => '' };
    if (name.includes('stored')) return { useAdminContext: () => ({ districts: [], propType: [] }) };
    if (name.startsWith('./') && name.endsWith('Select')) return { [name.slice(2)]: name.slice(2) };
    return {};
  }};
  vm.runInNewContext(code, sandbox);
  const tree = sandbox.exports.AddressSelectCustom({ inline, form, nameProvince: 'ProvinceId', nameDistrict: 'DistrictId', nameWard: 'WardId', nameStreet: 'StreetId', nameAddressNumber: 'AddressNumber', onApply: () => closed++ });
  const nodes = [];
  function walk(node) { if (!node || typeof node !== 'object') return; nodes.push(node); for (const child of [].concat(node.props?.children ?? [])) walk(child); }
  walk(tree);
  return { tree, nodes, values, counts: () => [submitted, closed] };
}
test('inline area selector clears dependent IDs and applies the existing form once', () => {
  const h = setup(true);
  h.nodes.find((n) => n.type === 'ProvinceSelect').props.onChange(9);
  assert.equal(h.values.ProvinceId, 9);
  assert.equal(h.values.DistrictId, undefined);
  assert.equal(h.values.WardId, undefined);
  assert.equal(h.values.StreetId, undefined);
  h.nodes.find((n) => n.props?.className?.includes('property-admin-address-apply-btn')).props.onClick();
  assert.deepEqual(h.counts(), [1, 1]);
});
test('existing region button retains its dropdown presentation', () => {
  assert.equal(setup(false).tree.type, 'dropdown');
});
