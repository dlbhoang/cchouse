const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const compile = (file) => ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const fixtureSandbox = { exports: {}, URLSearchParams };
vm.runInNewContext(compile('src/lib/dev/admin-ui-fixtures.ts'), fixtureSandbox);

function harness({ mode = 'development', signedIn = true } = {}) {
  const calls = [];
  class Response {
    constructor(body, options = {}) { this.body = body; this.status = options.status ?? 200; this.headers = options.headers; }
    static json(body, options) { return new Response(body, options); }
  }
  const sandbox = {
    exports: {}, Headers, URLSearchParams, console,
    process: { env: { NODE_ENV: mode, ADMIN_UI_QA: '1', NEXT_PUBLIC_API_URL: 'http://test-api.invalid/api' } },
    require(name) {
      if (name === 'next/server') return { NextResponse: Response };
      if (name === '@/services/auth/auth') return { auth: async () => signedIn ? { user: { token: 'unit-test-token' } } : null };
      if (name === '@/lib/dev/admin-ui-fixtures') return fixtureSandbox.exports;
      throw new Error(`Unexpected dependency: ${name}`);
    },
    fetch: async (...args) => {
      calls.push(args);
      return { status: 200, headers: new Headers({ 'content-type': 'application/json' }), arrayBuffer: async () => new ArrayBuffer(0) };
    },
  };
  vm.runInNewContext(compile('src/app/api/proxy/[...path]/route.ts'), sandbox);
  const request = (method) => sandbox.exports[method]({
    method, headers: new Headers(), nextUrl: new URL('http://localhost:3003/api/proxy/Property?pageSize=10'),
  }, { params: Promise.resolve({ path: ['Property'] }) });
  return { request, calls };
}

test('authenticated local QA read returns fixtures without contacting backend', async () => {
  const h = harness(); const r = await h.request('GET');
  assert.equal(r.status, 200); assert.equal(r.body.data.length, 10);
  assert.equal(r.headers['X-Admin-UI-Fixture'], '1'); assert.equal(h.calls.length, 0);
});
test('QA write is blocked before reaching backend', async () => {
  const h = harness(); const r = await h.request('POST');
  assert.equal(r.status, 405); assert.equal(h.calls.length, 0);
});
test('QA mode does not provide mock records without an authenticated session', async () => {
  const h = harness({ signedIn: false }); const r = await h.request('GET');
  assert.equal(r.status, 401); assert.equal(h.calls.length, 0);
});
test('production ignores the QA flag and preserves normal proxy forwarding', async () => {
  const h = harness({ mode: 'production' }); const r = await h.request('GET');
  assert.equal(r.status, 200); assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0][0], 'http://test-api.invalid/api/Property?pageSize=10');
  assert.equal(h.calls[0][1].headers.get('Authorization'), 'Bearer unit-test-token');
});
