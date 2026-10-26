const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");
function load(file, mocks = {}) {
  const source = ts.transpileModule(
    fs.readFileSync(path.join(process.cwd(), file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    },
  ).outputText;
  const mod = { exports: {} };
  new Function("require", "module", "exports", source)(
    (id) => (Object.hasOwn(mocks, id) ? mocks[id] : require(id)),
    mod,
    mod.exports,
  );
  return mod.exports;
}
const types = load("src/lib/errors/types.ts");
test("redacts secrets, email addresses and query strings", () => {
  assert.equal(
    types.cleanErrorPath("https://test/api?token=secret#value"),
    "/api",
  );
  const output = types.cleanErrorText(
    "password=secret token=abc Bearer abc user@example.com https://test/file.js?token=abc",
  );
  for (const secret of [
    "secret",
    "=abc",
    "Bearer abc",
    "user@example.com",
    "?token",
  ])
    assert.ok(!output.includes(secret));
});
test("authenticated ingestion, validation, manager-only listing, pagination and persistence", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "cchouse-errors-"));
  process.env.CLIENT_ERROR_LOG_DIR = directory;
  const store = load("src/lib/errors/store.ts", { "server-only": {} });
  let session = null;
  const api = load("src/app/api/client-errors/route.ts", {
    "@/services/auth/auth": { auth: async () => session },
    "@/lib/core/configs/appConst": { appConst: { MANAGER_ROLES: [1, 2, 6] } },
    "@/lib/errors/types": types,
    "@/lib/errors/store": store,
  });
  const { NextRequest } = require("next/server");
  const req = (method, data, query = "") =>
    new NextRequest(`http://localhost/api/client-errors${query}`, {
      method,
      headers: {
        origin: "http://localhost",
        host: "localhost",
        "content-type": "application/json",
      },
      ...(data === undefined ? {} : { body: JSON.stringify(data) }),
    });
  try {
    assert.equal(
      (await api.POST(req("POST", { kind: "react", message: "test" }))).status,
      401,
    );
    session = { user: { Id: 7, Name: "Test User", RoleId: 3 } };
    assert.equal((await api.GET(req("GET"))).status, 403);
    assert.equal(
      (await api.POST(req("POST", { kind: "unknown", message: "test" })))
        .status,
      400,
    );
    assert.equal((await api.POST(req("POST", null))).status, 400);
    assert.equal(
      (
        await api.POST(
          req("POST", { kind: "react", message: "x".repeat(21000) }),
        )
      ).status,
      413,
    );
    const proxiedOrigin = new NextRequest(
      "http://localhost/api/client-errors",
      {
        method: "POST",
        headers: {
          origin: "https://admin.example.com",
          host: "admin.example.com",
          "x-forwarded-proto": "https",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          kind: "react",
          message: "proxy origin accepted",
        }),
      },
    );
    assert.equal((await api.POST(proxiedOrigin)).status, 201);
    const day = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(path.join(directory, "2000-01-01.jsonl"), "{}\n");
    assert.equal(
      (
        await api.POST(
          req("POST", {
            kind: "react",
            message: "test error",
            path: "/admin?token=abc",
            stack: "password=secret",
            userId: "spoofed",
          }),
        )
      ).status,
      201,
    );
    assert.ok(!fs.existsSync(path.join(directory, "2000-01-01.jsonl")));
    session.user.RoleId = 1;
    const result = await (
      await api.GET(req("GET", undefined, `?day=${day}&q=test&kind=react`))
    ).json();
    assert.equal(result.total, 2);
    assert.equal(result.data[0].userId, "7");
    assert.equal(result.data[0].path, "/admin");
    assert.ok(!result.data[0].stack.includes("secret"));
    assert.equal(
      (
        await (
          await api.GET(req("GET", undefined, `?day=${day}&page=2`))
        ).json()
      ).data.length,
      0,
    );
    assert.equal(
      (await api.GET(req("GET", undefined, "?day=../../etc/passwd"))).status,
      400,
    );
    const forbidden = new NextRequest("http://localhost/api/client-errors", {
      method: "POST",
      headers: { origin: "https://evil.example" },
      body: "{}",
    });
    assert.equal((await api.POST(forbidden)).status, 403);
    const reader = load("src/lib/errors/store.ts", { "server-only": {} });
    assert.equal((await reader.readClientErrors(day)).length, 2);
    session.user.Id = 8;
    for (let i = 0; i < 60; i++)
      await api.POST(req("POST", { kind: "invalid", message: "rate test" }));
    assert.equal(
      (await api.POST(req("POST", { kind: "react", message: "rate test" })))
        .status,
      429,
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
    delete process.env.CLIENT_ERROR_LOG_DIR;
  }
});
