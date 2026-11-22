const assert = require("node:assert/strict");
const { test } = require("node:test");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { runInNewContext } = require("node:vm");
const ts = require("typescript");

const source = readFileSync(join(__dirname, "../src/lib/components/shared/MyModal/DeletedImg/events.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
});
const sandbox = { exports: {}, require };
runInNewContext(compiled.outputText, sandbox);
const { groupMediaEvents } = sandbox.exports;

test("groups file additions and removals from the same edit and orders newest first", () => {
  const deleted = {
    Id: 1,
    CreatedBy: "A",
    CreatedDate: "2026-05-21T09:24:00",
    UpdatedBy: "B",
    UpdatedDate: "2026-05-22T10:41:15.001",
    IsDeleted: true,
  };
  const added = {
    Id: 2,
    CreatedBy: "B",
    CreatedDate: "2026-05-22T10:41:15.008",
    UpdatedBy: "C",
    UpdatedDate: "2026-05-23T00:00:00",
  };
  const events = groupMediaEvents([deleted, added]);
  assert.equal(events.length, 2);
  assert.equal(events[0].actor, "B");
  assert.equal(events[0].added[0], added);
  assert.equal(events[0].removed[0], deleted);
  assert.equal(events[1].added[0], deleted);
});
