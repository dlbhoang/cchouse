const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const ts = require('typescript');

test('reverse conversion keeps the chosen ward on number edits and submits collapsed fields', async (t) => {
  const browser = await chromium.launch({ channel: process.env.CHROMIUM_CHANNEL || undefined });
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.setContent('<div id="root"></div>');
  for (const script of ['react/umd/react.development.js', 'react-dom/umd/react-dom.development.js',
    'dayjs/dayjs.min.js', 'antd/dist/antd.min.js']) {
    await page.addScriptTag({ path: `node_modules/${script}` });
  }
  const source = fs.readFileSync('src/lib/components/admin/property/form/propAddEdit/addressInfo/index.tsx', 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
  });
  await page.evaluate(() => {
    window.exports = {};
    window.lookups = 0;
    window.require = (name) => {
      if (name === 'react') return React;
      if (name === 'antd') return antd;
      if (name.endsWith('/stored')) return { useAdminContext: () => ({ propType: [] }) };
      if (name.endsWith('/mergeWardApi')) return { default: { get: async () => {
        window.lookups++;
        return { data: [31, 32].map(id => ({ NewWardId: 8, NewDistrictId: 9, OldWardId: id,
          OldWardName: `Phường ${id}`, OldDistrictName: 'Quận cũ', OldDistrictId: 4 })) };
      } } };
      if (name.endsWith('/wardApi')) return { default: { getById: async () => ({ data: { DistrictId: 9 } }) } };
      if (name.endsWith('/checkAddress')) return { default: () => null };
      return Object.fromEntries(['ProvinceSelect', 'WardSelect', 'DistrictSelect', 'StreetSelect',
        'DirectionSelect', 'SubAddressSelect'].map(key => [key, antd.Input]));
    };
  });
  await page.addScriptTag({ content: outputText });
  await page.evaluate(() => {
    function Fixture() {
      const [form] = antd.Form.useForm();
      return React.createElement(antd.Form, { form, initialValues: { PropAddress: { WardId: 8, StreetId: 12 } },
        onFinish: values => { window.saved = values.PropAddress; window.savedNote = values.Note; } },
      React.createElement(antd.Form.Item, { name: 'Note', initialValue: 'Ghi chú ban đầu' }, React.createElement(antd.Input.TextArea)),
      React.createElement(window.exports.default, { form }),
      React.createElement('button', { type: 'submit' }, 'Lưu'));
    }
    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Fixture));
  });
  const secondStreet = page.getByLabel('Tên đường thứ hai');
  await secondStreet.fill('Trần Phú');
  await secondStreet.fill('');
  assert.equal(await page.locator('#Note').inputValue(), 'Ghi chú ban đầu');
  await secondStreet.fill('Lê Lợi');
  await page.getByRole('switch').click();
  await page.getByRole('combobox').click();
  await page.getByText('Phường 32, Quận cũ', { exact: true }).click();
  await page.getByRole('button', { name: '+ Thêm địa chỉ cũ' }).click();
  await page.getByLabel('Tên đường (cũ)').fill('15');
  await page.getByLabel('Số nhà', { exact: true }).fill('27A');
  assert.equal(await page.getByLabel('Phường / xã (cũ)').inputValue(), '32');
  await page.getByRole('button', { name: 'Thu gọn' }).click();
  assert.equal(await page.getByLabel('Phường / xã (cũ)').isVisible(), false);
  await page.getByRole('button', { name: 'Lưu', exact: true }).click();
  await page.waitForFunction(() => window.saved);
  const persisted = await page.evaluate(() => window.savedNote);
  assert.equal(persisted, 'Ghi chú ban đầu\nTên đường thứ hai: Lê Lợi');
  await page.locator('#Note').fill('');
  await page.locator('#Note').fill(persisted);
  assert.equal(await secondStreet.inputValue(), 'Lê Lợi');
  const saved = await page.evaluate(() => window.saved);
  assert.equal(await page.evaluate(() => window.lookups), 1);
  assert.deepEqual([saved.DistrictId, saved.OldDistrictId, saved.OldWardId, saved.OldStreetId,
    saved.OldAddressNumber, saved.AddressNumber], [9, 4, 32, '15', '27A', '27A']);
});
