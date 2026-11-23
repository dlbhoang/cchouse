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
      if (name === 'lucide-react') return { Plus: () => null, X: () => null };
      if (name.endsWith('/stored')) return { useAdminContext: () => ({ propType: [] }) };
      if (name.endsWith('/mergeWardApi')) return { default: { get: async () => {
        window.lookups++;
        return { data: [31, 32].map(id => ({ NewWardId: 8, NewDistrictId: 9, OldWardId: id,
          OldWardName: `Phường ${id}`, OldDistrictName: 'Quận cũ', OldDistrictId: 4 })) };
      } } };
      if (name.endsWith('/wardApi')) return { default: {
        getById: async () => ({ data: { DistrictId: 9 } }),
        convertOldAddress: async () => ({ data: { ProvinceId: 1, NewDistrictId: 9, NewWardId: 8, StreetName: 'Lê Lợi' } }),
      } };
      if (name.endsWith('/streetApi')) return { default: { get: async () => ({ data: [{ Id: 15, Name: 'Lê Lợi' }] }) } };
      if (name.endsWith('/checkAddress')) return { default: () => null };
      if (name.endsWith('/MySelect')) return {
        ProvinceSelect: antd.Input, WardSelect: antd.Input, DistrictSelect: antd.Input,
        DirectionSelect: antd.Input,
        StreetSelect: props => React.createElement(antd.Select, {
          ...props, options: [{ value: 15, label: 'Lê Lợi' }, { value: 12, label: 'Đường chính' }],
        }),
      };
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
  await page.getByRole('button', { name: 'Thêm tên đường' }).click();
  const secondStreet = page.getByLabel('Tên đường thứ hai');
  await secondStreet.fill('Lê Lợi');
  await page.getByLabel('Số nhà thứ hai').fill('12B');
  await page.getByRole('button', { name: 'Bỏ địa chỉ thứ hai' }).click();
  assert.equal(await page.locator('#Note').inputValue(), 'Ghi chú ban đầu');
  await page.getByRole('button', { name: 'Thêm tên đường' }).click();
  await secondStreet.fill('Lê Lợi');
  await page.getByLabel('Số nhà thứ hai').fill('12B');
  await page.getByRole('switch').click();
  await page.getByRole('combobox', { name: 'Chọn phường / xã cũ' }).click();
  await page.getByText('Phường 32, Quận cũ', { exact: true }).click();
  await page.getByRole('button', { name: '+ Thêm địa chỉ cũ' }).click();
  await page.getByLabel('Tên đường (cũ)').click();
  await page.getByText('Lê Lợi', { exact: true }).last().click();
  await page.getByLabel('Số nhà', { exact: true }).fill('27A');
  assert.equal(await page.getByLabel('Phường / xã (cũ)').inputValue(), '32');
  await page.getByRole('switch').click();
  await page.getByRole('switch').click();
  assert.equal(await page.getByLabel('Phường / xã (cũ)').inputValue(), '32');
  assert.equal(await page.getByRole('combobox', { name: 'Chọn phường / xã cũ' }).count(), 0);
  await page.getByRole('button', { name: 'Thu gọn' }).click();
  assert.equal(await page.getByLabel('Phường / xã (cũ)').isVisible(), false);
  await page.getByRole('button', { name: 'Lưu', exact: true }).click();
  await page.waitForFunction(() => window.saved);
  const saved = await page.evaluate(() => window.saved);
  assert.equal(await page.evaluate(() => window.savedNote), 'Ghi chú ban đầu');
  assert.equal(saved.SecondStreetName, 'Lê Lợi');
  assert.equal(saved.SecondAddressNumber, '12B');
  assert.deepEqual([saved.DistrictId, saved.OldDistrictId, saved.OldWardId, saved.OldStreetId,
    saved.OldAddressNumber, saved.AddressNumber], [9, 4, 32, 15, '27A', '27A']);
});
