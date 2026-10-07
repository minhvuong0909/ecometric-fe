const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const exportsObject = {};
vm.runInNewContext(
  ts.transpileModule(
    fs.readFileSync("src/features/app/lib/dashboard-presentation.ts", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText,
  { exports: exportsObject, Intl, Date, Math },
);
const { formatEmission, formatNumber, getDashboardParams } = exportsObject;
assert.equal(formatEmission(0.0000123), "0,0000123 kgCO₂e");
assert.equal(formatEmission(999), "999 kgCO₂e");
assert.equal(formatEmission(1000), "1 tCO₂e");
assert.equal(formatNumber(1.318), "1,318");
const now = new Date(2026, 2, 31, 14, 30);
const before = now.getTime();
for (const [period, month, day] of [
  ["7d", 2, 25],
  ["30d", 2, 1],
  ["1y", 0, 1],
]) {
  const params = getDashboardParams("business", period, now);
  const start = new Date(params.periodStart);
  assert.equal(start.getMonth(), month);
  assert.equal(start.getDate(), day);
  assert.equal(start.getHours(), 0);
  assert.equal(params.periodEnd, now.toISOString());
  assert.equal(params.businessId, "business");
}
assert.equal(now.getTime(), before);
assert.equal(getDashboardParams(null, "30d", now).businessId, undefined);
console.log(
  "PASS: emission precision, unit boundary, calendar periods and immutable dates.",
);
